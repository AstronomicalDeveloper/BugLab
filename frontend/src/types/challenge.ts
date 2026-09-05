/**
 * Contrato de datos de la experiencia del desafío.
 *
 * La forma cruda (`RawChallenge`) es lo que entrega `challenge.json`.
 * La forma normalizada (`NormalizedChallenge`) es la única que consumen
 * componentes y hooks: nunca leen nombres crudos del JSON.
 */

/** Un componente del sistema descrito en la arquitectura del caso. */
export interface ArchitectureNode {
  nombre: string;
  descripcion: string;
}

export interface ChallengeReport {
  sintoma: string;
  comportamientoEsperado: string;
  pasosParaReproducir: string[];
}

export interface ChallengeArchitecture {
  componentes: ArchitectureNode[];
  flujo: string;
}

/**
 * Archivo que el usuario puede editar.
 *
 * `contenidoInicial` puede llegar vacío: hoy `challenge.json` declara la ruta
 * del archivo editable pero no su código semilla (vive en `challenges/<id>/files/`,
 * que el frontend no lee). El editor muestra un estado explícito en ese caso.
 */
export interface EditableFile {
  ruta: string;
  contenidoInicial: string;
}

export interface Hint {
  nivel: number;
  texto: string;
}

export interface ExplanationFields {
  causaRaiz: string;
  razonamiento: string;
  conceptoTransferible: string;
}

/**
 * La explicación llega en una de dos formas según cómo esté armado el caso:
 * como Markdown en crudo (el backend lee `explanation.md`) o como los tres
 * campos ya separados (si el JSON del caso los embebe). La interfaz representa
 * las dos.
 */
export type ChallengeExplanation =
  | { formato: "markdown"; texto: string }
  | { formato: "campos"; campos: ExplanationFields };

/**
 * Un archivo del caso con su contenido.
 *
 * Se sirven todos, editables o no: descubrir en cuál está el fallo es parte
 * del ejercicio, así que el explorador tiene que poder abrirlos todos. Solo
 * el marcado `editable` acepta cambios.
 */
export interface ChallengeFile {
  ruta: string;
  contenido: string;
  editable: boolean;
}

export interface NormalizedChallenge {
  id: string;
  titulo: string;
  nivel: string;
  aprendizajePrincipal: string;
  reporte: ChallengeReport;
  arquitectura: ChallengeArchitecture;
  /** Rutas declaradas por el caso, en orden. */
  arbolArchivos: string[];
  /** Los archivos navegables, con su contenido. */
  archivos: ChallengeFile[];
  /** Siempre array, aunque el JSON traiga `archivoEditable` singular. */
  editableFiles: EditableFile[];
  /** Vacío si el caso no embebe pistas en `challenge.json`. */
  pistas: Hint[];
  /** `null` si el caso no embebe la explicación en `challenge.json`. */
  explicacionFinal: ChallengeExplanation | null;
}

/** JSON sin validar, tal cual llega de la red o del mock. */
export type RawChallenge = Record<string, unknown>;

/* ---------------------------------- API ---------------------------------- */

export interface TestOutcome {
  name: string;
  passed: boolean;
}

/** Resultado de validación ya normalizado (`passed`/`total` garantizados). */
export interface ValidationResult {
  success: boolean;
  passed: number;
  total: number;
  tests: TestOutcome[];
}

/** Payload que se envía al backend al ejecutar los tests. */
export interface SubmittedFile {
  path: string;
  content: string;
}
