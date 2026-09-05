import { spawn } from "node:child_process";
import { constants } from "node:fs";
import {
  access,
  chmod,
  cp,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BACKEND_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
/**
 * `challenges/` vive dentro de `backend/`. Es la misma carpeta que lee
 * `challenge.service.ts` para servir el caso al frontend: una sola fuente de
 * verdad para contenido y para ejecución.
 */
const CHALLENGES_ROOT = path.resolve(BACKEND_ROOT, "challenges");
/** Los sandboxes efímeros sí se quedan dentro de `backend/`. */
const TEMP_ROOT = path.join(BACKEND_ROOT, "temp");
const DOCKER_EXECUTABLE = process.env.DOCKER_EXECUTABLE?.trim() || "docker";
const RUNNER_IMAGE = process.env.BUGLAB_RUNNER_IMAGE?.trim() || "buglab-runner:latest";
const VALIDATION_TIMEOUT_MS = 10_000;
const CONTAINER_CLEANUP_TIMEOUT_MS = 5_000;
const MAX_CAPTURED_OUTPUT_BYTES = 1_000_000;

export interface ChallengeFile {
  path: string;
  content: string;
}

export interface ChallengeTestResult {
  name: string;
  passed: boolean;
}

export interface ChallengeValidationResult {
  challengeId: string;
  success: boolean;
  passed: number;
  failed: number;
  total: number;
  tests: ChallengeTestResult[];
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
}

interface ChallengeConfig {
  id: string;
  editableFiles: string[];
}

interface VitestJsonReport {
  success?: unknown;
  numPassedTests?: unknown;
  numFailedTests?: unknown;
  numTotalTests?: unknown;
  testResults?: unknown;
}

interface ProcessResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
}

export class ChallengeValidationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "ChallengeValidationError";
  }
}

function isPathInside(parent: string, candidate: string): boolean {
  const relative = path.relative(parent, candidate);
  return relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function assertSafeRelativePath(filePath: string): void {
  if (
    filePath.length === 0 ||
    filePath.includes("\0") ||
    path.isAbsolute(filePath) ||
    path.win32.isAbsolute(filePath) ||
    filePath.includes("\\")
  ) {
    throw new ChallengeValidationError(`Ruta no permitida: ${filePath}`, 400);
  }

  const segments = filePath.split("/");
  if (segments.some((segment) => segment === "" || segment === "." || segment === "..")) {
    throw new ChallengeValidationError(`Ruta no permitida: ${filePath}`, 400);
  }
}

/**
 * Whitelist de archivos que el alumno puede enviar.
 *
 * Sale de `archivoEditable.ruta` (o de `archivosEditables[].ruta` cuando el caso
 * tenga más de uno), que es exactamente el campo que el frontend le muestra al
 * alumno. Al derivarla de ahí, la interfaz y el sandbox no pueden desincronizarse.
 *
 * `editableFiles` se sigue aceptando como override explícito por si algún caso
 * necesita exponerle al sandbox algo distinto de lo que enseña la interfaz.
 */
function readEditablePaths(config: Record<string, unknown>): string[] {
  if (Array.isArray(config.editableFiles)) {
    return config.editableFiles.filter(
      (entry): entry is string => typeof entry === "string",
    );
  }

  const declared = Array.isArray(config.archivosEditables)
    ? config.archivosEditables
    : [config.archivoEditable];

  return declared.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null) return [];
    const ruta = (entry as { ruta?: unknown }).ruta;
    return typeof ruta === "string" ? [ruta] : [];
  });
}

async function loadChallenge(challengeId: string): Promise<{
  config: ChallengeConfig;
  challengeDirectory: string;
}> {
  if (!/^[A-Za-z0-9_-]+$/.test(challengeId)) {
    throw new ChallengeValidationError("challengeId inválido", 400);
  }

  const challengeDirectory = path.resolve(CHALLENGES_ROOT, challengeId);
  if (!isPathInside(CHALLENGES_ROOT, challengeDirectory)) {
    throw new ChallengeValidationError("challengeId inválido", 400);
  }

  try {
    const challengeStats = await stat(challengeDirectory);
    if (!challengeStats.isDirectory()) throw new Error("No es un directorio");
  } catch {
    throw new ChallengeValidationError(`El desafío ${challengeId} no existe`, 404);
  }

  let parsedConfig: unknown;
  try {
    parsedConfig = JSON.parse(
      await readFile(path.join(challengeDirectory, "challenge.json"), "utf8"),
    );
  } catch {
    throw new ChallengeValidationError(
      `La configuración de ${challengeId} no es válida`,
      500,
    );
  }

  if (
    typeof parsedConfig !== "object" ||
    parsedConfig === null ||
    !("id" in parsedConfig) ||
    parsedConfig.id !== challengeId
  ) {
    throw new ChallengeValidationError(
      `La configuración de ${challengeId} no es válida`,
      500,
    );
  }

  const editableFiles = readEditablePaths(parsedConfig as Record<string, unknown>);
  if (editableFiles.length === 0) {
    throw new ChallengeValidationError(
      `${challengeId} no declara ningún archivo editable`,
      500,
    );
  }

  for (const editablePath of editableFiles) {
    assertSafeRelativePath(editablePath);
  }

  return {
    config: { id: challengeId, editableFiles },
    challengeDirectory,
  };
}

function validateFiles(files: ChallengeFile[], allowedFiles: string[]): void {
  if (!Array.isArray(files)) {
    throw new ChallengeValidationError("files debe ser un arreglo", 400);
  }

  const allowed = new Set(allowedFiles);
  const received = new Set<string>();

  for (const file of files) {
    if (
      typeof file !== "object" ||
      file === null ||
      typeof file.path !== "string" ||
      typeof file.content !== "string"
    ) {
      throw new ChallengeValidationError("Cada archivo debe incluir path y content", 400);
    }

    assertSafeRelativePath(file.path);
    if (!allowed.has(file.path)) {
      throw new ChallengeValidationError(`Ruta no permitida: ${file.path}`, 400);
    }
    if (received.has(file.path)) {
      throw new ChallengeValidationError(`Archivo duplicado: ${file.path}`, 400);
    }
    received.add(file.path);
  }
}

function appendOutput(current: string, chunk: Buffer): string {
  if (Buffer.byteLength(current) >= MAX_CAPTURED_OUTPUT_BYTES) return current;
  const remaining = MAX_CAPTURED_OUTPUT_BYTES - Buffer.byteLength(current);
  return current + chunk.subarray(0, remaining).toString("utf8");
}

function removeContainer(containerName: string): Promise<string> {
  return new Promise((resolve) => {
    let errorOutput = "";
    let settled = false;

    const cleanup = spawn(
      DOCKER_EXECUTABLE,
      ["rm", "--force", containerName],
      {
        shell: false,
        windowsHide: true,
      },
    );

    const finish = (): void => {
      if (settled) return;
      settled = true;
      clearTimeout(cleanupTimeout);
      resolve(errorOutput);
    };

    cleanup.stderr.on("data", (chunk: Buffer) => {
      errorOutput = appendOutput(errorOutput, chunk);
    });
    cleanup.once("error", (error) => {
      errorOutput = appendOutput(errorOutput, Buffer.from(error.message));
      finish();
    });
    cleanup.once("close", finish);

    const cleanupTimeout = setTimeout(() => {
      errorOutput = appendOutput(
        errorOutput,
        Buffer.from("No se pudo eliminar el contenedor dentro del tiempo esperado"),
      );
      cleanup.kill("SIGKILL");
      finish();
    }, CONTAINER_CLEANUP_TIMEOUT_MS);
  });
}

function executeVitest(
  sandboxDirectory: string,
  reportDirectory: string,
): Promise<ProcessResult> {
  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    let settled = false;
    let timeout: ReturnType<typeof setTimeout>;
    let cleanupPromise: Promise<string> | null = null;
    const executionId = path.basename(sandboxDirectory).toLowerCase();
    const containerName = `buglab-runner-${executionId}`;

    const child = spawn(
      DOCKER_EXECUTABLE,
      [
        "run",
        "--rm",
        "--name",
        containerName,
        "--network",
        "none",
        "--memory",
        "256m",
        "--memory-swap",
        "256m",
        "--cpus",
        "0.5",
        "--pids-limit",
        "64",
        "--read-only",
        "--cap-drop",
        "ALL",
        "--security-opt",
        "no-new-privileges=true",
        "--user",
        "1000:1000",
        "--init",
        "--tmpfs",
        "/tmp:rw,noexec,nosuid,size=64m,mode=1777",
        "--mount",
        `type=bind,source=${sandboxDirectory},target=/workspace,readonly`,
        "--mount",
        `type=bind,source=${reportDirectory},target=/output`,
        RUNNER_IMAGE,
        "run",
        "tests",
        "--root",
        "/workspace",
        "--pool=threads",
        "--maxWorkers=1",
        "--reporter=json",
        "--outputFile",
        "/output/vitest-report.json",
      ],
      {
        shell: false,
        windowsHide: true,
      },
    );

    const finish = async (exitCode: number | null): Promise<void> => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      const cleanupError = await cleanupPromise;
      if (cleanupError) {
        stderr = appendOutput(stderr, Buffer.from(`\n${cleanupError}`));
      }
      resolve({
        stdout,
        stderr,
        exitCode: timedOut ? null : exitCode,
        timedOut,
      });
    };

    child.stdout.on("data", (chunk: Buffer) => {
      stdout = appendOutput(stdout, chunk);
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr = appendOutput(stderr, chunk);
    });
    child.once("error", (error) => {
      stderr = appendOutput(stderr, Buffer.from(error.message));
      void finish(null);
    });
    child.once("close", (exitCode) => {
      void finish(exitCode);
    });

    timeout = setTimeout(() => {
      timedOut = true;
      cleanupPromise = removeContainer(containerName);
      child.kill("SIGKILL");
    }, VALIDATION_TIMEOUT_MS);
  });
}

function numberOrZero(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

async function readVitestReport(reportPath: string): Promise<VitestJsonReport | null> {
  try {
    return JSON.parse(await readFile(reportPath, "utf8")) as VitestJsonReport;
  } catch {
    return null;
  }
}

function extractTests(report: VitestJsonReport | null): ChallengeTestResult[] {
  if (!report || !Array.isArray(report.testResults)) return [];

  return report.testResults.flatMap((fileResult: unknown) => {
    if (
      typeof fileResult !== "object" ||
      fileResult === null ||
      !("assertionResults" in fileResult) ||
      !Array.isArray(fileResult.assertionResults)
    ) {
      return [];
    }

    return fileResult.assertionResults.map((assertion: unknown) => {
      const value =
        typeof assertion === "object" && assertion !== null ? assertion : {};
      const name =
        "title" in value && typeof value.title === "string"
          ? value.title
          : "fullName" in value && typeof value.fullName === "string"
            ? value.fullName
            : "Test sin nombre";

      return {
        name,
        passed: "status" in value && value.status === "passed",
      };
    });
  });
}

export async function validateChallenge(
  challengeId: string,
  files: ChallengeFile[],
): Promise<ChallengeValidationResult> {
  const { config, challengeDirectory } = await loadChallenge(challengeId);
  validateFiles(files, config.editableFiles);

  const officialTestsDirectory = path.join(challengeDirectory, "tests");
  try {
    await access(officialTestsDirectory, constants.R_OK);
  } catch {
    throw new ChallengeValidationError(
      "No se encuentran los tests oficiales",
      500,
    );
  }

  await mkdir(TEMP_ROOT, { recursive: true });
  const sandboxDirectory = await mkdtemp(path.join(TEMP_ROOT, `${challengeId}-`));
  const reportDirectory = path.join(sandboxDirectory, ".results");
  const reportPath = path.join(reportDirectory, "vitest-report.json");

  try {
    await mkdir(reportDirectory);
    await chmod(reportDirectory, 0o777);

    for (const file of files) {
      const destination = path.resolve(sandboxDirectory, file.path);
      if (!isPathInside(sandboxDirectory, destination)) {
        throw new ChallengeValidationError(`Ruta no permitida: ${file.path}`, 400);
      }

      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, file.content, "utf8");
    }

    await cp(officialTestsDirectory, path.join(sandboxDirectory, "tests"), {
      recursive: true,
      force: false,
      errorOnExist: true,
    });

    const processResult = await executeVitest(sandboxDirectory, reportDirectory);
    const report = await readVitestReport(reportPath);
    const tests = extractTests(report);

    return {
      challengeId,
      success:
        processResult.exitCode === 0 &&
        !processResult.timedOut &&
        report?.success === true,
      passed: numberOrZero(report?.numPassedTests),
      failed: numberOrZero(report?.numFailedTests),
      total: numberOrZero(report?.numTotalTests),
      tests,
      stdout: processResult.stdout,
      stderr: processResult.stderr,
      exitCode: processResult.exitCode,
      timedOut: processResult.timedOut,
    };
  } finally {
    await rm(sandboxDirectory, { recursive: true, force: true });
  }
}
