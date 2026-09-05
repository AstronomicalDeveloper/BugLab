import type { ChallengeArchitecture } from "../types/challenge";

interface ArchitectureViewProps {
  arquitectura: ChallengeArchitecture;
}

/**
 * Flujo del sistema y responsabilidad de cada pieza.
 *
 * El nodo editable NO se resalta a propósito: junto con el explorador, este
 * panel es donde el estudiante deduce dónde puede estar el fallo. Marcarlo
 * respondería la pregunta que plantea el ejercicio.
 */
export default function ArchitectureView({
  arquitectura,
}: ArchitectureViewProps) {
  const flowNodes = arquitectura.flujo
    .split("→")
    .map((node) => node.trim())
    .filter(Boolean);

  return (
    <section
      className="challenge-panel challenge-surface challenge-surface--level-2"
      aria-labelledby="challenge-arch-title"
    >
      <h2 id="challenge-arch-title" className="challenge-panel__title">
        Arquitectura
      </h2>

      {flowNodes.length > 0 && (
        <p className="challenge-arch__flow">
          {flowNodes.map((node, index) => (
            <span key={node} style={{ display: "contents" }}>
              {index > 0 && (
                <span className="challenge-arch__arrow" aria-hidden="true">
                  →
                </span>
              )}
              <span className="challenge-arch__node">{node}</span>
            </span>
          ))}
        </p>
      )}

      <dl className="challenge-arch__list">
        {arquitectura.componentes.map((componente) => (
          <div key={componente.nombre}>
            <dt className="challenge-arch__term">{componente.nombre}</dt>
            <dd className="challenge-arch__desc">{componente.descripcion}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
