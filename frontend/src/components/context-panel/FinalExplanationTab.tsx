import type { FinalExplanation } from "../../types";

export interface FinalExplanationTabProps {
  explanation: FinalExplanation;
  locked: boolean;
}

export function FinalExplanationTab({ explanation, locked }: FinalExplanationTabProps) {
  if (locked) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-line px-4 py-10 text-center">
        <span aria-hidden="true" className="text-xl">
          🔒
        </span>
        <p className="text-sm text-ink-muted">
          Se desbloquea cuando el caso queda resuelto (todos los tests en verde).
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-success/40 bg-success/5 p-4">
      <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wide text-success">
        ✓ {explanation.title}
      </p>
      <p className="text-sm leading-relaxed text-ink">{explanation.body}</p>
    </div>
  );
}
