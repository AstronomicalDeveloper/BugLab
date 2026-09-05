import { useParams } from "react-router-dom";
import { mockChallenges } from "../data/mockChallenges";
import { Button } from "../components/common/Button";
import { DifficultyBadge } from "../components/common/DifficultyBadge";

/**
 * Placeholder de la pantalla principal del desafío (Propuesta §4).
 *
 * Los componentes del workspace de 3 paneles ya existen en src/components/
 * (WorkspacePanel, ContextPanel, TestRunnerPanel). Se conectan acá en la
 * siguiente tanda; por ahora esta ruta existe para que los enlaces del
 * catálogo lleven a algún lado.
 */
export function ChallengePage() {
  const { challengeId } = useParams();
  const challenge = mockChallenges.find((item) => item.id === challengeId);

  if (!challenge) {
    return (
      <main className="mx-auto max-w-3xl px-4 pt-24 pb-24 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Ese desafío no existe
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Puede que el enlace esté mal escrito. Vuelve al catálogo para elegir
          uno de los tres casos disponibles.
        </p>
        <div className="mt-8">
          <Button to="/">Ver desafíos</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pt-16 pb-24 sm:px-6 sm:pt-24">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs text-ink-muted">
          {challenge.code}
        </span>
        <DifficultyBadge difficulty={challenge.difficulty} />
      </div>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
        {challenge.title}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-ink-muted">
        {challenge.report.symptom}
      </p>

      <div className="glass-2 mt-10 rounded-xl p-6">
        <p className="text-sm leading-relaxed text-ink-muted">
          El entorno de trabajo de este caso todavía no está conectado. El
          explorador, el editor y el panel de pruebas llegan en la próxima
          entrega.
        </p>
      </div>

      <div className="mt-8">
        <Button to="/" variant="ghost">
          Volver a desafíos
        </Button>
      </div>
    </main>
  );
}
