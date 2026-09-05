/**
 * Cliente HTTP de la experiencia del desafío.
 *
 * Las rutas relativas `/api/...` las redirige el proxy de Vite al backend en
 * desarrollo (ver `vite.config.ts`); no se hardcodea el puerto en ningún fetch.
 */
import { MOCK_CHALLENGES } from "../mocks";
import type {
  RawChallenge,
  SubmittedFile,
  TestOutcome,
  ValidationResult,
} from "../types/challenge";

/**
 * El caso se lee del backend. Poner en `true` para trabajar sin backend
 * levantado: entonces se sirve desde `src/mocks/`.
 *
 * Ojo: el mock es copia de `challenge.json` en crudo, así que no trae pistas,
 * explicación ni código semilla — esas piezas las combina el backend.
 */
export const USE_MOCK: boolean = false;

/** Lectura del caso. El backend debería servir `challenges/{id}/challenge.json`. */
const CHALLENGE_ENDPOINT = (caseId: string) =>
  `/api/challenges/${encodeURIComponent(caseId)}`;

/**
 * Ejecución de tests.
 *
 * El backend expone hoy `POST /api/validation/:challengeId`, no
 * `POST /api/challenges/:id/validate`. Se apunta a la ruta que existe de verdad
 * para que el flujo funcione end to end; si el backend adopta la otra, basta
 * cambiar esta línea.
 */
const VALIDATION_ENDPOINT = (caseId: string) =>
  `/api/validation/${encodeURIComponent(caseId)}`;

export class ApiError extends Error {}

async function readJson(response: Response): Promise<unknown> {
  if (!response.ok) {
    throw new ApiError(`El servidor respondió ${response.status}.`);
  }
  return (await response.json()) as unknown;
}

export async function fetchChallenge(caseId: string): Promise<RawChallenge> {
  if (USE_MOCK) {
    const mock = MOCK_CHALLENGES[caseId];
    if (!mock) {
      throw new ApiError(`No hay datos locales para el caso ${caseId}.`);
    }
    return mock;
  }

  const raw = await readJson(await fetch(CHALLENGE_ENDPOINT(caseId)));
  if (typeof raw !== "object" || raw === null) {
    throw new ApiError("El caso recibido no tiene un formato reconocible.");
  }
  return raw as RawChallenge;
}

/**
 * Normaliza la respuesta de validación.
 *
 * El backend actual devuelve `{ challengeId, success, tests }` sin `passed` ni
 * `total`, así que ambos se derivan de `tests` cuando faltan. Si más adelante
 * el backend los envía, se respetan los valores que manda.
 */
function normalizeValidation(raw: unknown): ValidationResult {
  const source = (raw ?? {}) as Record<string, unknown>;

  const tests: TestOutcome[] = Array.isArray(source.tests)
    ? source.tests.map((test) => {
        const item = (test ?? {}) as Record<string, unknown>;
        return {
          name: typeof item.name === "string" ? item.name : "Test sin nombre",
          passed: item.passed === true,
        };
      })
    : [];

  const total =
    typeof source.total === "number" ? source.total : tests.length;
  const passed =
    typeof source.passed === "number"
      ? source.passed
      : tests.filter((test) => test.passed).length;
  const success =
    typeof source.success === "boolean"
      ? source.success
      : total > 0 && passed === total;

  return { success, passed, total, tests };
}

export async function runTests(
  caseId: string,
  files: SubmittedFile[]
): Promise<ValidationResult> {
  const response = await fetch(VALIDATION_ENDPOINT(caseId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ files }),
  });

  return normalizeValidation(await readJson(response));
}
