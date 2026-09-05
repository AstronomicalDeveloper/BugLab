import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Los datos de cada caso viven repartidos en varios archivos dentro de
 * `challenges/<id>/`. Este servicio los combina EN MEMORIA para devolver un
 * único documento con la forma que ya consume el frontend. No toca el disco ni
 * reorganiza nada: el reparto físico se mantiene tal cual.
 */

const HERE = path.dirname(fileURLToPath(import.meta.url));

/**
 * `challenges/` está dentro de `backend/`. Se resuelve
 * desde la ubicación de este módulo y no desde `process.cwd()`, para que dé
 * igual desde qué carpeta se arranque el servidor.
 *
 * Funciona igual compilado: tanto `backend/src/services/` como
 * `backend/dist/services/` quedan a dos niveles de `backend/`.
 */
const CHALLENGES_DIR = path.resolve(HERE, "..", "..", "challenges");

/** Ids permitidos. Bloquea `..`, separadores y cualquier salto de carpeta. */
const VALID_ID = /^[A-Za-z0-9._-]+$/;

export class ChallengeNotFoundError extends Error {}

function isMissingFile(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: unknown }).code === "ENOENT"
  );
}

async function readText(filePath: string): Promise<string> {
  return readFile(filePath, "utf8");
}

/** Devuelve `null` si el archivo no existe; propaga cualquier otro error. */
async function readOptionalText(filePath: string): Promise<string | null> {
  try {
    return await readText(filePath);
  } catch (error) {
    if (isMissingFile(error)) return null;
    throw error;
  }
}

function parseJson(source: string, label: string): Record<string, unknown> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(source);
  } catch {
    throw new Error(`${label} no es JSON válido.`);
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error(`${label} no contiene un objeto.`);
  }

  return parsed as Record<string, unknown>;
}

/**
 * Resuelve una ruta declarada dentro del caso y verifica que no se escape de su
 * carpeta. `archivoEditable.ruta` ya viene con el prefijo `files/`, pero se
 * acepta también sin él.
 */
function resolveInsideChallenge(
  challengeDir: string,
  declaredPath: string
): string[] {
  const candidates = [
    path.resolve(challengeDir, declaredPath),
    path.resolve(challengeDir, "files", path.basename(declaredPath)),
  ];

  const boundary = challengeDir + path.sep;
  return candidates.filter((candidate) => candidate.startsWith(boundary));
}

async function readDeclaredFile(
  challengeDir: string,
  declaredPath: string
): Promise<string | null> {
  for (const candidate of resolveInsideChallenge(challengeDir, declaredPath)) {
    const content = await readOptionalText(candidate);
    if (content !== null) return content;
  }
  return null;
}

/** Un archivo del caso tal como lo consume el explorador del frontend. */
interface ChallengeFile {
  ruta: string;
  contenido: string;
  editable: boolean;
}

/**
 * Lee el contenido de todos los archivos declarados en `arbolArchivos`.
 *
 * El explorador los muestra todos y solo uno es editable: descubrir cuál hay
 * que tocar es parte del ejercicio, así que el resto tiene que poder abrirse
 * y leerse igual. Los que no existen en disco se omiten en vez de romper la
 * carga del caso.
 */
async function readChallengeFiles(
  challengeDir: string,
  declaredPaths: unknown,
  editablePath: string | null
): Promise<ChallengeFile[]> {
  if (!Array.isArray(declaredPaths)) return [];

  const files = await Promise.all(
    declaredPaths.map(async (declared): Promise<ChallengeFile | null> => {
      if (typeof declared !== "string") return null;

      const contenido = await readDeclaredFile(challengeDir, declared);
      if (contenido === null) return null;

      return { ruta: declared, contenido, editable: declared === editablePath };
    })
  );

  return files.filter((file): file is ChallengeFile => file !== null);
}

/**
 * Arma el documento completo del caso: `challenge.json` como base, más las
 * pistas, la explicación y el código semilla del archivo editable.
 *
 * Las piezas complementarias son opcionales: si falta alguna, el campo
 * simplemente no se agrega y el frontend ya sabe representar esa ausencia.
 */
export async function loadChallenge(
  id: string
): Promise<Record<string, unknown>> {
  if (!VALID_ID.test(id)) {
    throw new ChallengeNotFoundError(`Id de caso inválido: ${id}`);
  }

  const challengeDir = path.join(CHALLENGES_DIR, id);

  let base: Record<string, unknown>;
  try {
    base = parseJson(
      await readText(path.join(challengeDir, "challenge.json")),
      `challenge.json de ${id}`
    );
  } catch (error) {
    if (isMissingFile(error)) {
      throw new ChallengeNotFoundError(`No existe el caso ${id}.`);
    }
    throw error;
  }

  const combined: Record<string, unknown> = { ...base };

  // 1. Pistas — `hints.json` las envuelve en `{ "pistas": [...] }`.
  const hintsSource = await readOptionalText(
    path.join(challengeDir, "hints.json")
  );
  if (hintsSource !== null) {
    const hints = parseJson(hintsSource, `hints.json de ${id}`);
    if (Array.isArray(hints.pistas)) {
      combined.pistas = hints.pistas;
    }
  }

  // 2. Explicación final — se entrega como Markdown en crudo.
  const explanation = await readOptionalText(
    path.join(challengeDir, "explanation.md")
  );
  if (explanation !== null) {
    combined.explicacionFinal = explanation;
  }

  // 3. Código semilla del archivo editable.
  const editable = base.archivoEditable;
  let editablePath: string | null = null;

  if (typeof editable === "object" && editable !== null) {
    const declaredPath = (editable as { ruta?: unknown }).ruta;
    if (typeof declaredPath === "string") {
      editablePath = declaredPath;
      const content = await readDeclaredFile(challengeDir, declaredPath);
      if (content !== null) {
        combined.archivoEditable = {
          ...(editable as Record<string, unknown>),
          contenidoInicial: content,
        };
      }
    }
  }

  // 4. Contenido de todos los archivos del caso, editables o no, para que el
  //    explorador pueda abrirlos.
  combined.archivos = await readChallengeFiles(
    challengeDir,
    base.arbolArchivos,
    editablePath
  );

  return combined;
}
