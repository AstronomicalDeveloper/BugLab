import { NavLink } from "react-router-dom";
import { cn } from "../../lib/cn";

/**
 * Barra de navegación general (Propuesta §2). No confundir con TopNavbar.tsx,
 * que es la barra compacta de dentro de un desafío.
 *
 * "La opción activa estará resaltada con una superficie de vidrio de tono
 * morado o azul" (§2).
 */

const links = [
  { to: "/", label: "Desafíos", end: true },
  { to: "/progress", label: "Mi progreso", end: false },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6">
      <nav className="glass-1 mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full pr-2 pl-5">
        <NavLink
          to="/"
          className="font-mono text-base font-semibold tracking-tight text-ink"
        >
          Bug<span className="text-accent">Lab</span>
        </NavLink>

        <ul className="flex items-center gap-1">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    "block rounded-full px-4 py-2 font-mono text-xs font-medium transition-colors",
                    isActive
                      ? "border border-accent/45 bg-accent/15 text-accent-soft"
                      : "border border-transparent text-ink-muted hover:text-ink",
                  )
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
