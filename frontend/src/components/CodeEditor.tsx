import { useEffect, useRef, useState } from "react";
import type { EditableFile } from "../types/challenge";
import type { EditorContents } from "../hooks/useEditorState";

interface CodeEditorProps {
  /** Siempre array. Hoy puede traer un solo archivo; el componente no cambia. */
  files: EditableFile[];
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
  contents,
  onChange,
  onReset,
  isDirty,
}: CodeEditorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Si cambia el conjunto de archivos, la pestaña activa vuelve a la primera.
  useEffect(() => {
    setActiveIndex(0);
  }, [files]);

  if (files.length === 0) {
    return (
      <section className="challenge-panel challenge-surface challenge-surface--level-1">
        <h2 className="challenge-panel__title">Editor</h2>
        <p className="challenge-panel__note">
          Este caso no declara ningún archivo editable.
        </p>
      </section>
    );
  }

  const activeFile = files[Math.min(activeIndex, files.length - 1)];
  const value = contents[activeFile.ruta] ?? "";
  const hasSeedCode = activeFile.contenidoInicial.trim() !== "";

  function focusTab(index: number) {
    const next = (index + files.length) % files.length;
    setActiveIndex(next);
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
        aria-label="Archivos editables"
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
            onClick={() => setActiveIndex(index)}
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
            {isDirty(file.ruta) && (
              <span className="challenge-editor__dirty" aria-hidden="true">
                ●
              </span>
            )}
          </button>
        ))}
      </div>

      <div
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
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            wrap="off"
          />
        </div>

        {!hasSeedCode && (
          <p className="challenge-editor__empty">
            El caso declara <code>{activeFile.ruta}</code> como archivo editable,
            pero <code>challenge.json</code> no incluye su código inicial. Escribe
            la solución desde cero o pide que el backend envíe el contenido.
          </p>
        )}
      </div>

      <div className="challenge-editor__foot">
        <span className="challenge-editor__path">{activeFile.ruta}</span>
        <button
          type="button"
          className="challenge-button challenge-button--ghost challenge-button--sm"
          onClick={() => onReset(activeFile.ruta)}
          disabled={!isDirty(activeFile.ruta)}
        >
          Restaurar
        </button>
      </div>
    </section>
  );
}
