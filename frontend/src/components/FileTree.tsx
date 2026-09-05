import type { ChallengeFile } from "../types/challenge";

interface FileTreeProps {
  files: ChallengeFile[];
  activePath: string | null;
  onSelect: (ruta: string) => void;
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

/**
 * Explorador del caso. Todos los archivos se abren.
 *
 * A propósito NO se marca cuál es editable: averiguar dónde está el fallo es
 * el ejercicio. Que un archivo sea de solo lectura se descubre al abrirlo, no
 * antes, y eso se avisa dentro del editor.
 */
export default function FileTree({
  files,
  activePath,
  onSelect,
}: FileTreeProps) {
  return (
    <section
      className="challenge-panel challenge-surface challenge-surface--level-2"
      aria-labelledby="challenge-tree-title"
    >
      <h2 id="challenge-tree-title" className="challenge-panel__title">
        Archivos del caso
      </h2>

      <ul className="challenge-tree">
        {files.map((file) => {
          const isActive = file.ruta === activePath;
          return (
            <li key={file.ruta}>
              <button
                type="button"
                onClick={() => onSelect(file.ruta)}
                aria-current={isActive ? "true" : undefined}
                className={
                  isActive
                    ? "challenge-tree__item challenge-tree__item--active"
                    : "challenge-tree__item"
                }
              >
                <FileIcon />
                <span className="challenge-tree__path" title={file.ruta}>
                  {file.ruta}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="challenge-tree__legend">
        Abre cualquier archivo para leerlo. Solo uno acepta cambios: encontrar
        cuál es parte del ejercicio.
      </p>
    </section>
  );
}
