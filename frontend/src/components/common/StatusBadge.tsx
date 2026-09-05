import type { ChallengeStatus } from "../../types";
import { Badge, type BadgeTone } from "./Badge";

/**
 * Estados del catálogo (Propuesta §3). Las etiquetas son las del documento
 * — "Sin comenzar" / "En progreso" / "Resuelto" —, no las internas del tipo.
 */
const statusConfig: Record<ChallengeStatus, { label: string; tone: BadgeTone }> = {
  pendiente: { label: "Sin comenzar", tone: "neutral" },
  "en-analisis": { label: "En progreso", tone: "warning" },
  resuelto: { label: "Resuelto", tone: "success" },
};

export interface StatusBadgeProps {
  status: ChallengeStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge tone={config.tone} dot className={className}>
      {config.label}
    </Badge>
  );
}
