import type { ChallengeStatus, ChallengeSummary } from "../../types";
import { cn } from "../../lib/cn";

const statusDot: Record<ChallengeStatus, string> = {
  pendiente: "bg-ink-muted",
  "en-analisis": "bg-warning",
  resuelto: "bg-success",
};

/**
 * Slot modular del navbar. Contenedor + comportamiento ya funcionan
 * (selección, estado activo, estado por reto); el diseño puntual de cada
 * botón (icono, tooltip, lo que haga falta por bug) lo puede reemplazar tu
 * compañero sin tocar el contrato de props.
 */
export interface ChallengeSelectorProps {
  challenges: ChallengeSummary[];
  selectedChallengeId: string;
  onSelect: (id: string) => void;
}

export function ChallengeSelector({
  challenges,
  selectedChallengeId,
  onSelect,
}: ChallengeSelectorProps) {
  return (
    <div role="tablist" aria-label="Seleccionar reto" className="flex items-center gap-1.5">
      {challenges.map((challenge) => {
        const isActive = challenge.id === selectedChallengeId;
        return (
          <button
            key={challenge.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(challenge.id)}
            className={cn(
              "flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-xs font-medium transition-colors",
              isActive
                ? "border-accent bg-accent/10 text-accent"
                : "border-line text-ink-muted hover:border-line hover:text-ink",
            )}
          >
            <span
              className={cn("h-1.5 w-1.5 rounded-full", statusDot[challenge.status])}
              aria-hidden="true"
            />
            {challenge.code}
          </button>
        );
      })}
    </div>
  );
}
