interface FileTreeProps {
  /** Rutas de referencia del caso. No hay contenido asociado: no se navegan. */
  paths: string[];
  editablePaths: string[];
}

function FileIcon() {
  return (
    <svg
      className="challenge-tree__icon"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <path d="M9 1.5H4.5A1.5 1.5 0 0 0 3 3v10A1.5 1.5 0 0 0 4.5 14.5h7A1.5 1.5 0 0 0 13 13V5.5L9 1.5Z" />
      <path d="M9 1.5V5.5H13" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      className="challenge-tree__icon"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11.5 2.5 13.5 4.5 5.5 12.5 2.5 13.5 3.5 10.5 11.5 2.5Z" />
    </svg>
  );
}

export default function FileTree({ paths, editablePaths }: FileTreeProps) {
  const editable = new Set(editablePaths);

  return (
    <section
      className="challenge-panel challenge-surface challenge-surface--level-2"
      aria-labelledby="challenge-tree-title"
    >
      <h2 id="challenge-tree-title" className="challenge-panel__title">
        Archivos del caso
      </h2>

      <ul className="challenge-tree">
        {paths.map((path) => {
          const isEditable = editable.has(path);
          return (
            <li
              key={path}
              className={
                isEditable
                  ? "challenge-tree__item challenge-tree__item--editable"
                  : "challenge-tree__item"
              }
            >
              {isEditable ? <PencilIcon /> : <FileIcon />}
              <span className="challenge-tree__path" title={path}>
                {path}
              </span>
              {isEditable && (
                <span className="challenge-tree__badge">Editable</span>
              )}
            </li>
          );
        })}
      </ul>

      <p className="challenge-tree__legend">
        Solo el archivo marcado como editable se abre en el editor. El resto se
        lista como referencia del flujo.
      </p>
    </section>
  );
}
