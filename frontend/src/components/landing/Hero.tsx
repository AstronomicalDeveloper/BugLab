import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

/**
 * El bucle de aprendizaje de la Propuesta §1. Es una secuencia real, así que
 * va numerada y encadenada verticalmente — el mismo lenguaje visual que la
 * vista de arquitectura (§6).
 */
const method = [
  { step: "Observar", detail: "Lees el reporte de quien sufrió el fallo." },
  { step: "Ubicar", detail: "Recorres la arquitectura y los archivos." },
  { step: "Formular una hipótesis", detail: "Decides qué crees que pasa." },
  { step: "Modificar", detail: "Editas solo el código que corresponde." },
  { step: "Verificar", detail: "Las pruebas confirman o te desmienten." },
];

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-16 pb-4 sm:px-6 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
      <div>
        <h1 className="text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.4rem]">
          Aprende debugging investigando sistemas que{" "}
          <span className="relative isolate inline-block">
            <span
              aria-hidden="true"
              className="absolute inset-x-[-0.18em] top-[0.14em] bottom-[0.04em] -z-10 rounded-sm bg-gradient-to-r from-accent/40 via-accent/25 to-cyan/20"
            />
            realmente fallan
          </span>
          .
        </h1>

        <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-ink-muted">
          Cada caso empieza como empiezan los bugs de verdad: alguien reporta
          que algo se rompió. Tú recibes el sistema completo, no un enunciado
          con la respuesta escondida.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Button to="/#desafios" size="lg">
            Comenzar desafíos
          </Button>
          <Button to="/progress" variant="ghost" size="lg">
            Ver mi progreso
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <Badge tone="accent">3 desafíos</Badge>
          <Badge tone="cyan">JavaScript y React</Badge>
          <Badge>Sin instalar nada</Badge>
        </div>
      </div>

      <div className="glass-2 rounded-2xl p-6 sm:p-7">
        <p className="font-mono text-xs text-ink-muted">El método</p>
        <p className="mt-2 text-sm leading-relaxed text-ink">
          Los cinco pasos que repites en cada caso hasta que se vuelven
          reflejo.
        </p>

        <ol className="mt-6 space-y-1">
          {method.map((item, index) => (
            <li key={item.step} className="relative flex gap-4 pb-5 last:pb-0">
              {index < method.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-8 left-[13px] h-full w-px bg-gradient-to-b from-accent/40 to-accent/5"
                />
              )}
              <span className="relative grid h-7 w-7 shrink-0 place-items-center rounded-md border border-accent/30 bg-accent/10 font-mono text-[11px] font-medium text-accent-soft">
                {index + 1}
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-xs font-medium text-ink">
                  {item.step}
                </span>
                <span className="mt-1 block text-[13px] leading-relaxed text-ink-muted">
                  {item.detail}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
