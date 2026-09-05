import { useRef } from "react";
import type { ChallengeFile } from "../types/challenge";
import type { EditorContents } from "../hooks/useEditorState";

interface CodeEditorProps {
  /** Todos los archivos del caso. Los de solo lectura también se abren. */
  files: ChallengeFile[];
  /** Ruta abierta. La controla la página, para que el árbol la comparta. */
  activePath: string | null;
  onSelectPath: (ruta: string) => void;
  contents: EditorContents;
  onChange: (ruta: string, value: string) => void;
  onReset: (ruta: string) => void;
  isDirty: (ruta: string) => boolean;
}

function lineNumbers(value: string): string {
  const total = value.split("\n").length;
  return Array.from({ length: total }, (_, index) => index + 1).join("\n");
}

export default function CodeEditor({
  files,
  activePath,
  onSelectPath,
  contents,
  onChange,
  onReset,
  isDirty,
}: CodeEditorProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  if (files.length === 0) {
    return (
      <section className="challenge-panel challenge-surface challenge-surface--level-1">
        <h2 className="challenge-panel__title">Editor</h2>
        <p className="challenge-panel__note">
          Este caso no declara ningún archivo.
        </p>
      </section>
    );
  }

  const activeIndex = Math.max(
    0,
    files.findIndex((file) => file.ruta === activePath),
  );
  const activeFile = files[activeIndex];

  // Los editables llevan su valor en el estado del editor; los de solo lectura
  // se muestran tal como llegaron del backend.
  const value = activeFile.editable
    ? (contents[activeFile.ruta] ?? activeFile.contenido)
    : activeFile.contenido;

  const isEmpty = value.trim() === "";

  function focusTab(index: number) {
    const next = (index + files.length) % files.length;
    onSelectPath(files[next].ruta);
    tabRefs.current[next]?.focus();
  }

  return (
    <section
      className="challenge-editor challenge-surface challenge-surface--level-1"
      aria-labelledby="challenge-editor-title"
    >
      <h2 id="challenge-editor-title" className="challenge-sr-only">
        Editor de código
      </h2>

      <div
        className="challenge-editor__tablist"
        role="tablist"
        aria-label="Archivos del caso"
      >
        {files.map((file, index) => (
          <button
            key={file.ruta}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`challenge-tab-${index}`}
            aria-selected={index === activeIndex}
            aria-controls={`challenge-tabpanel-${index}`}
            tabIndex={index === activeIndex ? 0 : -1}
            className="challenge-editor__tab"
            onClick={() => onSelectPath(file.ruta)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") {
                event.preventDefault();
                focusTab(index + 1);
              } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                focusTab(index - 1);
              }
            }}
          >
            {file.ruta.split("/").pop()}
            {file.editable && isDirty(file.ruta) && (
              <span className="challenge-editor__dirty" aria-hidden="true">
                ●
              </span>
            )}
          </button>
        ))}
      </div>

      <div
        className="challenge-editor__tabpanel"
        role="tabpanel"
        id={`challenge-tabpanel-${activeIndex}`}
        aria-labelledby={`challenge-tab-${activeIndex}`}
      >
        <div className="challenge-editor__body">
          <div className="challenge-editor__gutter" aria-hidden="true">
            {lineNumbers(value)}
          </div>
          <textarea
            className="challenge-editor__textarea"
            aria-label={`Contenido de ${activeFile.ruta}`}
            value={value}
            rows={Math.max(value.split("\n").length, 12)}
            onChange={(event) => onChange(activeFile.ruta, event.target.value)}
            readOnly={!activeFile.editable}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            wrap="off"
          />
        </div>

        {isEmpty && (
          <p className="challenge-editor__empty">
            <code>{activeFile.ruta}</code> llegó sin contenido. Revisa que el
            archivo exista dentro de la carpeta del caso.
          </p>
        )}
      </div>

      <div className="challenge-editor__foot">
        <span className="challenge-editor__path">{activeFile.ruta}</span>

        {activeFile.editable ? (
          <button
            type="button"
            className="challenge-button challenge-button--ghost challenge-button--sm"
            onClick={() => onReset(activeFile.ruta)}
            disabled={!isDirty(activeFile.ruta)}
          >
            Restaurar
          </button>
        ) : (
          <span className="challenge-editor__readonly">
            Solo lectura · este archivo no se puede modificar
          </span>
        )}
      </div>
    </section>
  );
}
