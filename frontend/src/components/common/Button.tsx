import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";

/**
 * Propuesta §16: el azul es el color de las acciones principales; el morado
 * queda reservado para navegación activa, foco y selección.
 */
type Variant = "primary" | "ghost";
type Size = "md" | "lg";

const variantClass: Record<Variant, string> = {
  primary:
    "bg-action text-[#0c1220] border border-action/60 shadow-[0_6px_20px_-6px_rgba(112,165,255,0.65)] hover:bg-[#8ab6ff] hover:border-[#8ab6ff]",
  ghost:
    "glass-2 text-ink border-transparent hover:border-accent/45 hover:text-accent-soft",
};

const sizeClass: Record<Size, string> = {
  md: "h-10 px-4 text-xs",
  lg: "h-12 px-6 text-sm",
};

const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-md font-mono font-medium tracking-tight transition-colors disabled:cursor-not-allowed disabled:opacity-50";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  keyof CommonProps
>;

interface ButtonAsButton extends CommonProps, NativeButtonProps {
  to?: never;
}

interface ButtonAsLink extends CommonProps {
  /** Si viene `to`, se renderiza como enlace de router en vez de <button>. */
  to: string;
}

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/** Forma interna: `to` opcional y el resto de props nativas de <button>. */
type ResolvedProps = CommonProps & { to?: string } & NativeButtonProps;

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    to,
    ...nativeProps
  } = props as ResolvedProps;

  const classes = cn(baseClass, variantClass[variant], sizeClass[size], className);

  if (to !== undefined) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...nativeProps}>
      {children}
    </button>
  );
}
