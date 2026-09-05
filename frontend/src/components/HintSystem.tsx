import { useState } from "react";
import type { Hint } from "../types/challenge";

interface HintSystemProps {
  pistas: Hint[];
}

/**
 * Pistas en orden, una visible a la vez.
 *
 * Pedir una pista es una decisión del usuario, así que nunca se revelan solas:
 * el acento ámbar marca que ya se gastó una ayuda.
 */
export default function HintSystem({ pistas }: HintSystemProps) {
  const [revealed, setRevealed] = useState(0);

  const current = revealed > 0 ? pistas[revealed - 1] : null;
  const remaining = pistas.length - revealed;

  return (
    <section
      className="challenge-panel challenge-surface challenge-surface--level-2"
      aria-labelledby="challenge-hints-title"
    >
      <h2 id="challenge-hints-title" className="challenge-panel__title">
        Pistas
      </h2>

      {pistas.length === 0 ? (
        <p className="challenge-panel__note">
          Este caso no incluye pistas en <code>challenge.json</code>.
        </p>
      ) : (
        <>
          <div aria-live="polite">
            {current ? (
              <ul className="challenge-hints__list">
                <li className="challenge-hints__item">
                  <span className="challenge-hints__level">
                    Pista {current.nivel}
                  </span>
                  {current.texto}
                </li>
              </ul>
            ) : (
              <p className="challenge-panel__note challenge-hints__list">
                Intenta encontrar la causa por tu cuenta primero. Si te atascas,
                pide una pista.
              </p>
            )}
          </div>

          <div className="challenge-hints__footer">
            <span className="challenge-hints__counter">
              {revealed}/{pistas.length} usadas
            </span>
            <button
              type="button"
              className="challenge-button challenge-button--secondary challenge-button--sm"
              onClick={() => setRevealed((value) => value + 1)}
              disabled={remaining === 0}
            >
              {revealed === 0 ? "Ver pista" : "Ver siguiente pista"}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
