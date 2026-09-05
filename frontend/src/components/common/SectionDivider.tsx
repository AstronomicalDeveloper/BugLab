import type { ReactNode } from "react";
import { IconBug } from "../../lib/icons";

export interface SectionDividerProps {
  /** Glifo dentro del hexágono. Por defecto, la marca de BugLab. */
  icon?: ReactNode;
}

/**
 * Separador de sección: un hexágono de vidrio con un glifo, flanqueado por
 * dos hairlines que se desvanecen. Es decorativo, así que queda fuera del
 * árbol de accesibilidad.
 */
export function SectionDivider({ icon }: SectionDividerProps) {
  return (
    <div
      className="flex items-center justify-center gap-5 py-16 sm:py-20"
      aria-hidden="true"
    >
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-accent/35 sm:w-28" />

      <span className="relative grid h-11 w-11 place-items-center">
        <svg
          viewBox="0 0 44 44"
          className="absolute inset-0 h-full w-full text-accent/35"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M22 2.6 39.8 12.8v20.4L22 43.4 4.2 33.2V12.8z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
        <span className="relative text-accent-soft">
          {icon ?? <IconBug className="h-[18px] w-[18px]" />}
        </span>
      </span>

      <span className="h-px w-16 bg-gradient-to-l from-transparent to-accent/35 sm:w-28" />
    </div>
  );
}
