import type { ChallengeArchitecture } from "../types/challenge";

interface ArchitectureViewProps {
  arquitectura: ChallengeArchitecture;
  /** Rutas editables, para resaltar el nodo del flujo que se puede tocar. */
  editablePaths: string[];
}

/** `files/validation.js` → `["validation.js", "validation"]` */
function nameVariants(path: string): string[] {
  const file = path.split("/").pop() ?? path;
  return [file, file.replace(/\.[^.]+$/, "")];
}

export default function ArchitectureView({
  arquitectura,
  editablePaths,
}: ArchitectureViewProps) {
  const editableNames = new Set(editablePaths.flatMap(nameVariants));
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
          {flowNodes.map((node, index) => {
            const isEditable = editableNames.has(node);
            return (
              <span key={node} style={{ display: "contents" }}>
                {index > 0 && (
                  <span className="challenge-arch__arrow" aria-hidden="true">
                    →
                  </span>
                )}
                <span
                  className={
                    isEditable
                      ? "challenge-arch__node challenge-arch__node--editable"
                      : "challenge-arch__node"
                  }
                >
                  {node}
                  {isEditable && (
                    <span className="challenge-sr-only"> (editable)</span>
                  )}
                </span>
              </span>
            );
          })}
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
