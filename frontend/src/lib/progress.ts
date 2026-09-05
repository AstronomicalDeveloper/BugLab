import type { ChallengeStatus } from "../types";

/**
 * Progreso local del estudiante (Propuesta §13, §14). No hay cuentas de
 * usuario ni persistencia en servidor: todo vive en localStorage.
 *
 * Cada acceso va envuelto en try/catch porque localStorage lanza en modo
 * privado y con cookies de terceros bloqueadas. Si falla, la app sigue
 * funcionando con los estados por defecto de los desafíos.
 */

const STORAGE_KEY = "buglab.progress.v1";

export interface ChallengeProgress {
  status: ChallengeStatus;
  /** Cantidad de pistas reveladas en este caso. */
  hintsUsed: number;
  /** Tests superados en la última corrida. */
  testsPassed: number;
  testsTotal: number;
}

export type ProgressMap = Record<string, ChallengeProgress>;

export function readProgress(): ProgressMap {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    return parsed as ProgressMap;
  } catch {
    return {};
  }
}

export function writeProgress(progress: ProgressMap): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Sin almacenamiento disponible: el progreso solo dura esta sesión.
  }
}

/** El estado guardado si existe; si no, el que trae el desafío por defecto. */
export function resolveStatus(
  progress: ProgressMap,
  challengeId: string,
  fallback: ChallengeStatus,
): ChallengeStatus {
  return progress[challengeId]?.status ?? fallback;
}
