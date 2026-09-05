import { mockChallenges } from "../data/mockChallenges";
import { useProgress } from "../hooks/useProgress";
import { resolveStatus } from "../lib/progress";
import { StatusBadge } from "../components/common/StatusBadge";
import { Button } from "../components/common/Button";

/**
 * Pantalla de progreso (Propuesta §13). Vista mínima: lee localStorage y
 * muestra el avance. El detalle de tests superados y pistas usadas se agrega
 * cuando el workspace empiece a escribir progreso.
 */
export function ProgressPage() {
  const progress = useProgress();

  const statuses = mockChallenges.map((challenge) =>
    resolveStatus(progress, challenge.code, challenge.status),
  );
  const resolved = statuses.filter((status) => status === "resuelto").length;
  const inProgress = statuses.filter((status) => status === "en-analisis").length;
  const pending = statuses.length - resolved - inProgress;
  const percent = Math.round((resolved / statuses.length) * 100);

  return (
    <main className="mx-auto max-w-3xl px-4 pt-16 pb-24 sm:px-6 sm:pt-24">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Tu progreso
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        Se guarda solo en este navegador. No hay cuentas ni sincronización.
      </p>

      <div className="glass-2 mt-10 rounded-xl p-6">
        <div className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs text-ink-muted">
          <span>
            <span className="text-ink">{statuses.length}</span> desafíos
          </span>
          <span>
            <span className="text-success">{resolved}</span> resueltos
          </span>
          <span>
            <span className="text-warning">{inProgress}</span> en progreso
          </span>
          <span>
            <span className="text-ink">{pending}</span> pendientes
          </span>
        </div>

        <div
          className="mt-5 h-2 overflow-hidden rounded-full bg-panel"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Desafíos resueltos"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-cyan transition-[width]"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-2 font-mono text-[11px] text-ink-muted">{percent} %</p>
      </div>

      <ul className="mt-6 space-y-2">
        {mockChallenges.map((challenge, index) => (
          <li
            key={challenge.id}
            className="glass-2 flex items-center justify-between gap-4 rounded-lg px-5 py-4"
          >
            <span className="min-w-0">
              <span className="font-mono text-xs text-ink-muted">
                {challenge.code}
              </span>
              <span className="mt-1 block truncate text-sm text-ink">
                {challenge.title}
              </span>
            </span>
            <StatusBadge status={statuses[index]} />
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <Button to="/" variant="ghost">
          Volver a desafíos
        </Button>
      </div>
    </main>
  );
}
