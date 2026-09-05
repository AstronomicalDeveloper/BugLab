import type { ChallengeReport } from "../types/challenge";

interface ReportViewerProps {
  reporte: ChallengeReport;
}

export default function ReportViewer({ reporte }: ReportViewerProps) {
  return (
    <section
      className="challenge-panel challenge-surface challenge-surface--level-2"
      aria-labelledby="challenge-report-title"
    >
      <h2 id="challenge-report-title" className="challenge-panel__title">
        Reporte
      </h2>

      <div className="challenge-report__block">
        <p className="challenge-report__label">Síntoma</p>
        <p className="challenge-report__text">{reporte.sintoma}</p>
      </div>

      <div className="challenge-report__block">
        <p className="challenge-report__label">Comportamiento esperado</p>
        <p className="challenge-report__text">{reporte.comportamientoEsperado}</p>
      </div>

      {reporte.pasosParaReproducir.length > 0 && (
        <div className="challenge-report__block">
          <p className="challenge-report__label">Pasos para reproducir</p>
          {/* Numerados porque el orden importa: es una secuencia real. */}
          <ol className="challenge-report__steps">
            {reporte.pasosParaReproducir.map((paso) => (
              <li key={paso} className="challenge-report__step">
                {paso}
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
