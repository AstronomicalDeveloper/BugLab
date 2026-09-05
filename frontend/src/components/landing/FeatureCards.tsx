import type { ReactNode } from "react";
import { IconReport, IconSystem, IconTests } from "../../lib/icons";

interface Feature {
  icon: ReactNode;
  /** Color del glifo: recorre morado → azul → cian de la paleta §16. */
  tint: string;
  title: string;
  body: string;
}

const features: Feature[] = [
  {
    icon: <IconReport className="h-6 w-6" />,
    tint: "text-accent",
    title: "Un reporte, no un enunciado",
    body: "Empiezas por el síntoma que alguien describió en lenguaje llano, sin jerga técnica y sin pistas sobre dónde mirar. Ubicar el fallo es parte del ejercicio.",
  },
  {
    icon: <IconSystem className="h-6 w-6" />,
    tint: "text-action",
    title: "Un sistema, no un ejercicio",
    body: "Puedes ver cómo se conectan las piezas y recorrer los archivos como en un proyecto real. Solo son editables los que corresponden al caso.",
  },
  {
    icon: <IconTests className="h-6 w-6" />,
    tint: "text-cyan",
    title: "Pruebas de comportamiento",
    body: "Nadie compara tu código con una solución exacta. Las pruebas comprueban que el sistema volvió a comportarse como debía, llegues como llegues.",
  },
];

export function FeatureCards() {
  return (
    <section
      id="como-funciona"
      className="mx-auto max-w-6xl scroll-mt-28 px-4 sm:px-6"
    >
      <h2 className="max-w-[24ch] text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
        Se parece más a una investigación que a un ejercicio
      </h2>

      <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
        {features.map((feature) => (
          <article key={feature.title}>
            <span className={feature.tint}>{feature.icon}</span>
            <h3 className="mt-5 text-lg font-medium tracking-tight text-ink">
              {feature.title}
            </h3>
            <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-ink-muted">
              {feature.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
