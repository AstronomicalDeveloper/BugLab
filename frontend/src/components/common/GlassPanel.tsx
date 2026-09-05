import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { glassClass, type GlassLevel } from "../../lib/glass";

export interface GlassPanelProps {
  /** Nivel de vidrio según Propuesta §15. Ver src/lib/glass.ts. */
  level?: GlassLevel;
  /** Radio de la superficie. Las superficies grandes piden un radio mayor. */
  radius?: "md" | "lg" | "xl";
  className?: string;
  children: ReactNode;
}

const radiusClass = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-2xl",
} as const;

export function GlassPanel({
  level = 2,
  radius = "lg",
  className,
  children,
}: GlassPanelProps) {
  return (
    <div className={cn(glassClass(level), radiusClass[radius], className)}>
      {children}
    </div>
  );
}
