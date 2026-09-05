import { Link } from "react-router-dom";
import type { ChallengeStatus, ChallengeSummary } from "../../types";
import { DifficultyBadge } from "../common/DifficultyBadge";
import { StatusBadge } from "../common/StatusBadge";

export interface ChallengeCardProps {
  challenge: ChallengeSummary;
  /** Estado efectivo, resuelto contra el progreso local (§13). */
  status: ChallengeStatus;
}

/**
 * Tarjeta del catálogo (Propuesta §3): código, nivel, título, descripción
 * breve, conceptos principales y estado. Toda la tarjeta es el enlace, para
 * que el área de clic sea grande y haya un solo destino de tabulación.
 */
export function ChallengeCard({ challenge, status }: ChallengeCardProps) {
  return (
    <Link
      to={`/challenges/${challenge.code}`}
      className="glass-2 group flex flex-col rounded-xl p-5 transition-colors hover:border-accent/45"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs font-medium tracking-tight text-ink-muted transition-colors group-hover:text-accent-soft">
          {challenge.code}
        </span>
        <DifficultyBadge difficulty={challenge.difficulty} />
      </div>

      <h3 className="mt-4 text-lg leading-snug font-medium tracking-tight text-ink">
        {challenge.title}
      </h3>

      {challenge.summary && (
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {challenge.summary}
        </p>
      )}

      {challenge.concepts && challenge.concepts.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {challenge.concepts.map((concept) => (
            <li
              key={concept}
              className="rounded border border-line px-2 py-1 font-mono text-[10px] text-ink-muted"
            >
              {concept}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-4">
        <StatusBadge status={status} />
        <span className="font-mono text-[11px] text-ink-muted transition-colors group-hover:text-action">
          {status === "resuelto"
            ? "Ver explicación"
            : status === "en-analisis"
              ? "Continuar"
              : "Abrir caso"}
        </span>
      </div>
    </Link>
  );
}
