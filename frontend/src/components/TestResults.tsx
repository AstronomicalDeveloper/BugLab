import type { ValidationResult } from "../types/challenge";
import type { ValidationStatus } from "../hooks/useValidation";

interface TestResultsProps {
  status: ValidationStatus;
  result: ValidationResult | null;
  error: string | null;
  isSolved: boolean;
  /** `false` si el caso no trae la explicación final en su JSON. */
  explanationAvailable: boolean;
  onOpenExplanation: () => void;
}

export default function TestResults({
  status,
  result,
  error,
  isSolved,
  explanationAvailable,
  onOpenExplanation,
}: TestResultsProps) {
  const percent =
    result && result.total > 0 ? (result.passed / result.total) * 100 : 0;

  return (
    <section
      className="challenge-panel challenge-surface challenge-surface--level-3"
      aria-labelledby="challenge-results-title"
    >
      <div className="challenge-results__head">
        <h2 id="challenge-results-title" className="challenge-panel__title">
          Resultado de los tests
        </h2>
        {result && result.total > 0 && (
          <span
            className={
              isSolved
                ? "challenge-results__count challenge-results__count--pass"
                : "challenge-results__count challenge-results__count--fail"
            }
          >
            {result.passed}/{result.total}
          </span>
        )}
      </div>

      {result && result.total > 0 && (
        <div
          className="challenge-results__meter"
          role="progressbar"
          aria-valuenow={result.passed}
          aria-valuemin={0}
          aria-valuemax={result.total}
          aria-label="Tests que pasan"
        >
          <div
            className="challenge-results__meter-fill"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}

      {/* Los resultados se anuncian a lectores de pantalla al llegar. */}
      <div aria-live="polite">
        {status === "idle" && (
          <p className="challenge-results__empty">
            Edita el archivo y ejecuta los tests para ver el resultado.
          </p>
        )}

        {status === "running" && (
          <p className="challenge-results__empty">Ejecutando los tests…</p>
        )}

        {status === "error" && error && (
          <p className="challenge-alert" role="alert">
            {error}
          </p>
        )}

        {/* El runner respondió pero no llegó a ejecutar nada (sandbox caído,
            timeout, suite vacía). No es un intento fallido del alumno. */}
        {status === "done" && result && result.total === 0 && (
          <p className="challenge-alert" role="alert">
            No se pudieron ejecutar los tests. El problema es del entorno, no de
            tu código: avisa al equipo.
          </p>
        )}

        {status === "done" && result && result.total > 0 && (
          <ul className="challenge-results__list">
            {result.tests.map((test) => (
              <li
                key={test.name}
                className={
                  test.passed
                    ? "challenge-results__item challenge-results__item--pass"
                    : "challenge-results__item challenge-results__item--fail"
                }
              >
                <span className="challenge-results__mark" aria-hidden="true">
                  {test.passed ? "✓" : "✕"}
                </span>
                <span>{test.name}</span>
                <span className="challenge-sr-only">
                  {test.passed ? "Pasa" : "Falla"}
                </span>
              </li>
            ))}
          </ul>
        )}

        {isSolved && (
          <div className="challenge-results__solved">
            <p>Todos los tests pasan. Caso resuelto.</p>
            <button
              type="button"
              className="challenge-button challenge-button--secondary"
              onClick={onOpenExplanation}
              disabled={!explanationAvailable}
              title={
                explanationAvailable
                  ? undefined
                  : "Este caso no incluye la explicación en su JSON."
              }
            >
              Ver explicación
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
