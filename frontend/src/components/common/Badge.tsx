import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export type BadgeTone =
  | "neutral"
  | "accent"
  | "action"
  | "cyan"
  | "success"
  | "warning"
  | "error";

const toneClass: Record<BadgeTone, string> = {
  neutral: "border-line text-ink-muted",
  accent: "border-accent/40 text-accent-soft",
  action: "border-action/40 text-action",
  cyan: "border-cyan/40 text-cyan",
  success: "border-success/40 text-success",
  warning: "border-warning/40 text-warning",
  error: "border-error/40 text-error",
};

const dotClass: Record<BadgeTone, string> = {
  neutral: "bg-ink-muted",
  accent: "bg-accent",
  action: "bg-action",
  cyan: "bg-cyan",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
};

export interface BadgeProps {
  tone?: BadgeTone;
  /** Punto de color a la izquierda. El texto sigue siendo lo que comunica. */
  dot?: boolean;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Badge({
  tone = "neutral",
  dot = false,
  icon,
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] font-medium whitespace-nowrap",
        toneClass[tone],
        className,
      )}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotClass[tone])}
          aria-hidden="true"
        />
      )}
      {icon}
      {children}
    </span>
  );
}
