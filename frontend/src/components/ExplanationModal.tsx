import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import type { ChallengeExplanation } from "../types/challenge";

interface ExplanationModalProps {
  explicacion: ChallengeExplanation;
  onClose: () => void;
}

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Render mínimo de Markdown: títulos, párrafos, `código`, *cursiva* y **negrita**.
 * Cubre lo que usan los `explanation.md` del repo sin sumar una dependencia. Si
 * más adelante hacen falta listas o tablas, conviene cambiarlo por una librería.
 */
function renderInline(text: string): ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, index) => {
    const key = `${index}-${part}`;
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={key}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const nodes: ReactNode[] = [];
  let paragraph: string[] = [];

  // Se recorre línea a línea porque un título puede ir pegado a su párrafo,
  // separado por un único salto de línea.
  function flushParagraph(key: string) {
    if (paragraph.length === 0) return;
    const text = paragraph.join(" ");
    paragraph = [];
    nodes.push(
      <p key={key} className="challenge-modal__text">
        {renderInline(text)}
      </p>
    );
  }

  lines.forEach((line, index) => {
    const heading = line.match(/^#{1,6}\s+(.*)$/);

    if (heading) {
      flushParagraph(`p-${index}`);
      nodes.push(
        <p key={`h-${index}`} className="challenge-modal__label">
          {heading[1] ?? ""}
        </p>
      );
      return;
    }

    if (line.trim() === "") {
      flushParagraph(`p-${index}`);
      return;
    }

    paragraph.push(line.trim());
  });

  flushParagraph("p-final");

  return <>{nodes}</>;
}

/**
 * Se renderiza dentro del árbol de `ChallengePage`, no en un portal a `body`:
 * así conserva las variables `--challenge-*` que viven en `.challenge-root`.
 */
export default function ExplanationModal({
  explicacion,
  onClose,
}: ExplanationModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="challenge-modal__backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="challenge-modal challenge-surface challenge-surface--level-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="challenge-modal-title"
        tabIndex={-1}
      >
        <div className="challenge-modal__head">
          <h2 id="challenge-modal-title" className="challenge-modal__title">
            Qué estaba pasando
          </h2>
          <button
            type="button"
            className="challenge-modal__close"
            onClick={onClose}
            aria-label="Cerrar explicación"
          >
            ✕
          </button>
        </div>

        {explicacion.formato === "markdown" ? (
          <div className="challenge-modal__body">
            <Markdown source={explicacion.texto} />
          </div>
        ) : (
          <>
            <div className="challenge-modal__section">
              <p className="challenge-modal__label">Causa raíz</p>
              <p className="challenge-modal__text">
                {explicacion.campos.causaRaiz}
              </p>
            </div>

            <div className="challenge-modal__section">
              <p className="challenge-modal__label">Razonamiento</p>
              <p className="challenge-modal__text">
                {explicacion.campos.razonamiento}
              </p>
            </div>

            <div className="challenge-modal__section">
              <p className="challenge-modal__label">Concepto transferible</p>
              <p className="challenge-modal__text">
                {explicacion.campos.conceptoTransferible}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
