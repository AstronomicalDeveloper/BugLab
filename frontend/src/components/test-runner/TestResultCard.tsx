import type { TestCase } from "../../types";
import { cn } from "../../lib/cn";

export interface TestResultCardProps {
  test: TestCase;
}

export function TestResultCard({ test }: TestResultCardProps) {
  const state =
    test.passed === null ? "pending" : test.passed ? "passed" : "failed";

  const border =
    state === "passed" ? "border-success/40" : state === "failed" ? "border-error/40" : "border-line";
  const bg = state === "passed" ? "bg-success/5" : state === "failed" ? "bg-error/5" : "bg-canvas/40";

  return (
    <div className={cn("rounded-md border p-3", border, bg)}>
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="text-sm">
          {state === "passed" ? "✅" : state === "failed" ? "❌" : "⏳"}
        </span>
        <span className="flex-1 text-sm text-ink">{test.name}</span>
        <span
          className={cn(
            "font-mono text-[10px] font-semibold uppercase",
            state === "passed" && "text-success",
            state === "failed" && "text-error",
            state === "pending" && "text-ink-muted",
          )}
        >
          {state === "passed" ? "OK" : state === "failed" ? "Falla" : "Sin correr"}
        </span>
      </div>
      {test.message && <p className="mt-1.5 pl-6 text-xs text-ink-muted">{test.message}</p>}
    </div>
  );
}
