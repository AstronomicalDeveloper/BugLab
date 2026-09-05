import type { Difficulty } from "../../types";
import { Badge, type BadgeTone } from "./Badge";

/**
 * Mapeo fijo (design.md §2.2): Fácil → success · Intermedio → warning ·
 * Difícil → error. Es el mismo trío de colores que usa el badge de estado con
 * otro significado, así que la etiqueta de texto nunca se oculta.
 */
const difficultyConfig: Record<Difficulty, { label: string; tone: BadgeTone }> = {
  facil: { label: "Fácil", tone: "success" },
  intermedio: { label: "Intermedio", tone: "warning" },
  dificil: { label: "Difícil", tone: "error" },
};

export interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const config = difficultyConfig[difficulty];
  return (
    <Badge tone={config.tone} className={className}>
      {config.label}
    </Badge>
  );
}
