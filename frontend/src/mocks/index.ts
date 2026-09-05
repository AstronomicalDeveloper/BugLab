/**
 * Registro de casos mockeados.
 *
 * Único lugar del frontend donde puede aparecer un id de caso literal: es dato
 * de prueba, no lógica. Los componentes y hooks siempre reciben el id por props.
 *
 * `bug-001.json` es copia literal de `challenges/BUG-001/challenge.json`.
 * Se copia sin retoques a propósito: si al JSON real le falta algo, la interfaz
 * debe mostrarlo tal cual, no maquillarlo.
 */
import type { RawChallenge } from "../types/challenge";
import bug001 from "./bug-001.json";

export const MOCK_CHALLENGES: Record<string, RawChallenge> = {
  "BUG-001": bug001 as RawChallenge,
};

/** Caso que abre el harness de desarrollo cuando la URL no indica otro. */
export const DEFAULT_CASE_ID = "BUG-001";
