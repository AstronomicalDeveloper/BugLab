import type { SVGProps } from "react";

/**
 * Set mínimo de íconos de trazo, dibujados a mano. No usamos librería de
 * íconos (design.md §5) ni emoji en la landing: los emoji se pintan con la
 * paleta del sistema operativo y rompen la gama morado/azul/cian.
 *
 * Todos heredan el color con currentColor y no llevan relleno.
 */

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Documento con lupa: el reporte que abre cada caso. */
export function IconReport(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M13.2 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21H11" />
      <path d="M13.2 3 19 8.8V12" />
      <path d="M12.8 3.2v5.4h5.4" />
      <path d="M8.3 9.3h2.4M8.3 12.4h3.4" />
      <circle cx="16.4" cy="16.4" r="3.1" />
      <path d="m18.7 18.7 2.4 2.4" />
    </Icon>
  );
}

/** Dos nodos encadenados: la arquitectura del sistema. */
export function IconSystem(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="5.5" y="2.75" width="13" height="5" rx="1.6" />
      <rect x="5.5" y="16.25" width="13" height="5" rx="1.6" />
      <path d="M12 7.75v8.5" />
      <path d="m9.6 13.6 2.4 2.4 2.4-2.4" />
    </Icon>
  );
}

/** Lista de resultados: dos superados y uno fallido. */
export function IconTests(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m3.2 5.9 1.9 1.9 3.4-3.4" />
      <path d="M12.2 6.1h8.6" />
      <path d="m3.2 12.5 1.9 1.9 3.4-3.4" />
      <path d="M12.2 12.7h8.6" />
      <path d="m3.4 17.6 3.5 3.5M6.9 17.6l-3.5 3.5" />
      <path d="M12.2 19.3h5.4" />
    </Icon>
  );
}

/** Escarabajo: la marca de los separadores de sección. */
export function IconBug(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9.2 6.6a2.8 2.8 0 0 1 5.6 0" />
      <path d="M7.6 8.4h8.8v5.9a4.4 4.4 0 0 1-8.8 0z" />
      <path d="M12 8.4v10.2" />
      <path d="M7.6 10.6 4.3 9.2M7.6 13.6H4.1M7.6 16.6l-3 1.9" />
      <path d="m16.4 10.6 3.3-1.4M16.4 13.6h3.5M16.4 16.6l3 1.9" />
    </Icon>
  );
}

/** Candado: archivos de solo lectura en el explorador (§7). */
export function IconLock(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="4.75" y="10.5" width="14.5" height="10" rx="2" />
      <path d="M8.25 10.5V7.4a3.75 3.75 0 0 1 7.5 0v3.1" />
    </Icon>
  );
}

export function IconHexagon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 2.6 20.4 7.3v9.4L12 21.4 3.6 16.7V7.3z" />
    </Icon>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 12h15" />
      <path d="m13.2 5.7 6.3 6.3-6.3 6.3" />
    </Icon>
  );
}
