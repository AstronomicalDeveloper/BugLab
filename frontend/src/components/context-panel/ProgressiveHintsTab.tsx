import { useState } from "react";
import type { Hint } from "../../types";

export interface ProgressiveHintsTabProps {
  hints: Hint[];
}

/** Estado de revelado es local: montá este tab con `key={challengeId}` en el padre para resetearlo al cambiar de reto. */
export function ProgressiveHintsTab({ hints }: ProgressiveHintsTabProps) {
  const [revealed, setRevealed] = useState(0);
  const done = revealed >= hints.length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-wide text-warning">// pistas</span>
        <span className="font-mono text-[11px] text-ink-muted">
          {revealed}/{hints.length} usadas
        </span>
      </div>

      {revealed > 0 && (
        <ul className="flex flex-col gap-2">
          {hints.slice(0, revealed).map((hint, i) => (
            <li
              key={hint.id}
              className="flex gap-2 rounded-md border border-warning/30 bg-warning/5 px-3 py-2 text-sm text-ink"
            >
              <span className="font-mono font-semibold text-warning">{i + 1}.</span>
              <span>{hint.text}</span>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => setRevealed((r) => Math.min(r + 1, hints.length))}
        disabled={done}
        className="self-start rounded-md border border-line px-3 py-1.5 font-mono text-xs font-medium text-ink-muted transition-colors hover:border-warning/50 hover:text-warning disabled:cursor-not-allowed disabled:opacity-40"
      >
        {done ? "No quedan más pistas" : "Pedir una pista"}
      </button>
    </div>
  );
}
