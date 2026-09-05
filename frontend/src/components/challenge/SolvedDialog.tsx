import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { mockChallenges } from "../../data/mockChallenges";
import { Button } from "../common/Button";
import { DifficultyBadge } from "../common/DifficultyBadge";
import { IconArrowRight } from "../../lib/icons";

export interface SolvedDialogProps {
  /** Código del caso recién resuelto, por ejemplo "BUG-001". */
  caseId: string;
  onClose: () => void;
}

/**
 * Aparece al pasar todos los tests de un caso y ofrece el salto al siguiente
 * (Propuesta §11 y §12).
 *
 * Vive en el shell y no dentro de `ChallengePage` a propósito: navegar entre
 * casos es responsabilidad del shell, y ese paquete evita depender de
 * react-router (ver `src/pages/INTEGRACION.md`).
 */
export function SolvedDialog({ caseId, onClose }: SolvedDialogProps) {
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);

  const index = mockChallenges.findIndex(
    (challenge) => challenge.code === caseId,
  );
  const next = index >= 0 ? mockChallenges[index + 1] : undefined;
  const isLast = index >= 0 && next === undefined;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // El foco entra al diálogo para que Escape y el tabulador operen sobre él.
  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-[rgba(8,10,15,0.72)] p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="solved-title"
        tabIndex={-1}
        className="glass-1 w-full max-w-lg rounded-2xl p-7 outline-none sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="font-mono text-xs text-success">{caseId} · Resuelto</p>

        <h2
          id="solved-title"
          className="mt-3 text-2xl leading-tight font-semibold tracking-tight"
        >
          {isLast
            ? "Resolviste los tres casos"
            : "Recuperaste el comportamiento esperado"}
        </h2>

        {isLast ? (
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Cerraste el ciclo completo: un operador de comparación, un
            componente que no se desmontaba y una mutación por referencia. Son
            tres de los errores que más vas a volver a encontrar.
          </p>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Las pruebas confirman que el sistema volvió a comportarse como
            debía. Puedes leer la explicación del caso o pasar al siguiente.
          </p>
        )}

        {next && (
          <div className="glass-2 mt-6 rounded-xl p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-xs text-ink-muted">
                Siguiente · {next.code}
              </span>
              <DifficultyBadge difficulty={next.difficulty} />
            </div>
            <p className="mt-2 text-sm font-medium text-ink">{next.title}</p>
            {next.summary && (
              <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
                {next.summary}
              </p>
            )}
          </div>
        )}

        <div className="mt-7 flex flex-wrap gap-3">
          {next ? (
            <Button
              onClick={() => {
                onClose();
                navigate(`/challenges/${next.code}`);
              }}
            >
              Ir a {next.code}
              <IconArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={() => {
                onClose();
                navigate("/progress");
              }}
            >
              Ver mi progreso
            </Button>
          )}

          <Button variant="ghost" onClick={onClose}>
            Seguir en este caso
          </Button>
        </div>
      </div>
    </div>
  );
}
