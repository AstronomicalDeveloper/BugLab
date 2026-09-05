/**
 * Contratos de datos de BugLab. Esta es la única fuente de verdad de tipos:
 * todo componente de presentación recibe estos shapes por props, nunca
 * hardcodea contenido de un bug puntual. Ver design.md sección 3.
 */

export type Difficulty = "facil" | "intermedio" | "dificil";

export type ChallengeStatus = "pendiente" | "en-analisis" | "resuelto";

/** Lo mínimo que necesita el navbar/selector para listar un reto. */
export interface ChallengeSummary {
  id: string;
  code: string; // "BUG-001"
  title: string;
  difficulty: Difficulty;
  status: ChallengeStatus;
  /**
   * Descripción breve para la tarjeta del catálogo (Propuesta §3). Una o dos
   * frases en lenguaje llano: el síntoma, nunca la causa.
   */
  summary?: string;
  /** Conceptos principales del caso, para los chips de la tarjeta (§3). */
  concepts?: string[];
}

export interface BugReport {
  symptom: string;
  expectedBehavior: string;
  reportedBy: string;
  quote: string;
}

export interface ArchitectureNode {
  id: string;
  name: string;
  role: string;
  suspect?: boolean;
}

export interface Architecture {
  summary: string;
  nodes: ArchitectureNode[];
}

export interface Hint {
  id: string;
  text: string;
}

export interface FinalExplanation {
  title: string;
  body: string;
}

export type FileNodeKind = "file" | "folder";
export type FileAccess = "readonly" | "editable";

export interface FileNode {
  id: string;
  name: string;
  kind: FileNodeKind;
  /** Solo aplica a kind "file". */
  access?: FileAccess;
  /** Solo aplica a kind "folder". */
  children?: FileNode[];
}

export interface EditorTab {
  id: string; // matchea FileNode.id
  fileName: string;
  isDirty?: boolean;
}

export interface TestCase {
  id: string;
  name: string;
  /** null = todavía no se corrió ningún test para este caso. */
  passed: boolean | null;
  message?: string;
}

export interface ErrorDiff {
  expected: string;
  received: string;
  explanation?: string;
}

/** El objeto completo que arma un reto — lo que inyecta tu compañero. */
export interface Challenge extends ChallengeSummary {
  report: BugReport;
  architecture: Architecture;
  files: FileNode[];
  fileContents: Record<string, string>; // FileNode.id -> contenido
  hints: Hint[];
  finalExplanation: FinalExplanation;
  tests: TestCase[];
}

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  message: string;
}
