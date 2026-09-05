import { Link } from "react-router-dom";
import { IconArrowRight } from "../../lib/icons";

/**
 * Franja fina bajo el hero. Fija el posicionamiento de BugLab en una línea,
 * igual que la barra bordeada de la referencia de layout.
 */
export function ContextBar() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
      <div className="glass-2 flex flex-col gap-4 rounded-xl px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-sm leading-relaxed text-ink-muted">
          <span className="font-mono text-ink">BugLab</span> no te pide escribir
          código desde cero. Te entrega un sistema que ya se rompió y te pide
          averiguar por qué.
        </p>
        <Link
          to="/#como-funciona"
          className="inline-flex shrink-0 items-center gap-2 font-mono text-xs font-medium text-action transition-colors hover:text-accent-soft"
        >
          Cómo funciona
          <IconArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
