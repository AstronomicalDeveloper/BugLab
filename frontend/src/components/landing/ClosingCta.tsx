import { mockChallenges } from "../../data/mockChallenges";
import { Button } from "../common/Button";

export function ClosingCta() {
  const first = mockChallenges[0];

  return (
    <section className="mx-auto max-w-6xl px-4 pt-24 pb-16 sm:px-6">
      <div className="glass-1 flex flex-col items-start gap-6 rounded-2xl px-7 py-9 sm:px-10 sm:py-11 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="max-w-[22ch] text-2xl leading-tight font-semibold tracking-tight text-balance sm:text-3xl">
            El primer caso es un operador de comparación
          </h2>
          <p className="mt-3 max-w-[54ch] text-sm leading-relaxed text-ink-muted">
            Una persona cumple 18 años y el sistema la rechaza. Tienes el
            reporte, el código y las pruebas: te falta la causa.
          </p>
        </div>

        <Button to={`/challenges/${first.id}`} size="lg" className="shrink-0">
          Comenzar con {first.code}
        </Button>
      </div>

      <p className="mt-10 text-center font-mono text-[11px] text-ink-muted">
        BugLab · Proyecto educativo · El progreso se guarda en este navegador
      </p>
    </section>
  );
}
