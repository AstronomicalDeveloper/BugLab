import type { Architecture } from "../../types";
import { cn } from "../../lib/cn";

export interface ArchitectureTabProps {
  architecture: Architecture;
}

export function ArchitectureTab({ architecture }: ArchitectureTabProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm leading-relaxed text-ink-muted">{architecture.summary}</p>

      <div className="flex flex-col">
        {architecture.nodes.map((node, i) => (
          <div key={node.id} className="flex flex-col items-stretch">
            <div
              className={cn(
                "rounded-md border p-3",
                node.suspect ? "border-error/50 bg-error/5" : "border-line bg-canvas/40",
              )}
            >
              <p className="text-sm font-semibold text-ink">{node.name}</p>
              <p className="mt-1 text-xs text-ink-muted">{node.role}</p>
              {node.suspect && (
                <p className="mt-2 font-mono text-[10px] font-semibold uppercase tracking-wide text-error">
                  ⚠ posible origen del bug
                </p>
              )}
            </div>
            {i < architecture.nodes.length - 1 && (
              <span className="py-1 text-center font-mono text-ink-muted" aria-hidden="true">
                ↓
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
