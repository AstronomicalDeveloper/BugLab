import type { ChallengeStatus } from "../../types";
import { cn } from "../../lib/cn";

const statusConfig: Record<ChallengeStatus, { label: string; dot: string; text: string; border: string }> = {
  pendiente: {
    label: "Pendiente",
    dot: "bg-ink-muted",
    text: "text-ink-muted",
    border: "border-line",
  },
  "en-analisis": {
    label: "En análisis",
    dot: "bg-warning",
    text: "text-warning",
    border: "border-warning/40",
  },
  resuelto: {
    label: "Resuelto",
    dot: "bg-success",
    text: "text-success",
    border: "border-success/40",
  },
};

export interface ProgressBadgeProps {
  status: ChallengeStatus;
}

export function ProgressBadge({ status }: ProgressBadgeProps) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs font-medium",
        config.border,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} aria-hidden="true" />
      <span className={config.text}>{config.label}</span>
    </div>
  );
}
