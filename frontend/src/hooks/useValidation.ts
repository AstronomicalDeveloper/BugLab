import { useCallback, useState } from "react";
import { runTests } from "../services/api";
import type { SubmittedFile, ValidationResult } from "../types/challenge";

export type ValidationStatus = "idle" | "running" | "done" | "error";

const CONNECTION_ERROR = "No se pudo conectar con el servidor de validación.";

export interface ValidationState {
  status: ValidationStatus;
  result: ValidationResult | null;
  error: string | null;
  /** Cuántas veces se ejecutaron los tests en esta sesión. */
  attempts: number;
  /** Todos los tests pasaron en la última ejecución. */
  isSolved: boolean;
  run: (files: SubmittedFile[]) => Promise<void>;
}

/**
 * Ejecuta los tests contra el backend y expone el resultado.
 *
 * Aquí no se valida ni se ejecuta nada: solo se envía el código y se representa
 * lo que responde el servidor.
 */
export function useValidation(caseId: string): ValidationState {
  const [status, setStatus] = useState<ValidationStatus>("idle");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const run = useCallback(
    async (files: SubmittedFile[]) => {
      setStatus("running");
      setError(null);

      try {
        const outcome = await runTests(caseId, files);
        setResult(outcome);
        setStatus("done");
      } catch {
        setResult(null);
        setError(CONNECTION_ERROR);
        setStatus("error");
      } finally {
        setAttempts((previous) => previous + 1);
      }
    },
    [caseId]
  );

  const isSolved =
    result !== null &&
    result.success === true &&
    result.total > 0 &&
    result.passed === result.total;

  return { status, result, error, attempts, isSolved, run };
}
