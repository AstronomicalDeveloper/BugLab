import { useCallback, useEffect, useMemo, useState } from "react";
import type { EditableFile, SubmittedFile } from "../types/challenge";

/** Contenido en edición, indexado por ruta de archivo. */
export type EditorContents = Record<string, string>;

function seed(files: EditableFile[]): EditorContents {
  return Object.fromEntries(
    files.map((file) => [file.ruta, file.contenidoInicial])
  );
}

export interface EditorState {
  contents: EditorContents;
  setContent: (ruta: string, value: string) => void;
  /** Devuelve un archivo a su contenido inicial. */
  resetFile: (ruta: string) => void;
  /** `true` si esa ruta difiere de su contenido inicial. */
  isDirty: (ruta: string) => boolean;
  /** Payload listo para enviar al backend. */
  submittedFiles: SubmittedFile[];
}

/**
 * Estado del editor para N archivos.
 *
 * Se guarda como `Record<ruta, contenido>` y no como un string suelto para que
 * sumar un segundo archivo editable no obligue a cambiar nada aquí.
 */
export function useEditorState(files: EditableFile[]): EditorState {
  const [contents, setContents] = useState<EditorContents>(() => seed(files));

  // Al cargar otro caso, el editor arranca de cero.
  useEffect(() => {
    setContents(seed(files));
  }, [files]);

  const setContent = useCallback((ruta: string, value: string) => {
    setContents((previous) => ({ ...previous, [ruta]: value }));
  }, []);

  const resetFile = useCallback(
    (ruta: string) => {
      const original = files.find((file) => file.ruta === ruta);
      if (!original) return;
      setContents((previous) => ({
        ...previous,
        [ruta]: original.contenidoInicial,
      }));
    },
    [files]
  );

  const isDirty = useCallback(
    (ruta: string) => {
      const original = files.find((file) => file.ruta === ruta);
      if (!original) return false;
      return (contents[ruta] ?? "") !== original.contenidoInicial;
    },
    [contents, files]
  );

  const submittedFiles = useMemo<SubmittedFile[]>(
    () =>
      files.map((file) => ({
        path: file.ruta,
        content: contents[file.ruta] ?? file.contenidoInicial,
      })),
    [contents, files]
  );

  return { contents, setContent, resetFile, isDirty, submittedFiles };
}
