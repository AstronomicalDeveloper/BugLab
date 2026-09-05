import type { ErrorDiff } from "../../types";

export interface ErrorDiffViewProps {
  diff: ErrorDiff;
}

export function ErrorDiffView({ diff }: ErrorDiffViewProps) {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-line bg-canvas/60 p-3">
      <p className="font-mono text-[11px] uppercase tracking-wide text-ink-muted">// diff pedagógico</p>
      <div className="rounded border border-success/30 bg-success/5 px-2 py-1.5 font-mono text-xs text-success">
        Se esperaba: {diff.expected}
      </div>
      <div className="rounded border border-error/30 bg-error/5 px-2 py-1.5 font-mono text-xs text-error">
        Se recibió: {diff.received}
      </div>
      {diff.explanation && <p className="text-xs leading-relaxed text-ink-muted">{diff.explanation}</p>}
    </div>
  );
}
