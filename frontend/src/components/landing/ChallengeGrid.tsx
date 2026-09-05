import { mockChallenges } from "../../data/mockChallenges";
import { useProgress } from "../../hooks/useProgress";
import { resolveStatus } from "../../lib/progress";
import { ChallengeCard } from "../challenge/ChallengeCard";
import { Badge } from "../common/Badge";

/**
 * Catálogo de desafíos (Propuesta §3). El estado de cada tarjeta sale del
 * progreso local si existe; si no, del valor por defecto del desafío.
 */
export function ChallengeGrid() {
  const progress = useProgress();

  const resolved = mockChallenges.filter(
    (challenge) => resolveStatus(progress, challenge.id, challenge.status) === "resuelto",
  ).length;

  return (
    <section id="desafios" className="mx-auto max-w-6xl scroll-mt-28 px-4 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
            Tus desafíos
          </h2>
          <p className="mt-3 max-w-[50ch] text-sm leading-relaxed text-ink-muted">
            Tres casos, de un operador mal puesto a una mutación que se
            propaga sin que nadie la vea. Puedes resolverlos en cualquier
            orden.
          </p>
        </div>
        <Badge tone={resolved > 0 ? "success" : "neutral"} dot>
          {resolved} de {mockChallenges.length} resueltos
        </Badge>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {mockChallenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            status={resolveStatus(progress, challenge.id, challenge.status)}
          />
        ))}
      </div>
    </section>
  );
}
