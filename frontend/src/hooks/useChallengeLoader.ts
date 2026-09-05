import { useEffect, useState } from "react";
import { fetchChallenge } from "../services/api";
import type {
  ArchitectureNode,
  ChallengeExplanation,
  EditableFile,
  Hint,
  NormalizedChallenge,
  RawChallenge,
} from "../types/challenge";

/* ----------------------------- Lectores seguros ---------------------------- */

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}

function readRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function readArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

/**
 * La explicación puede venir como Markdown (lo que sirve el backend al leer
 * `explanation.md`) o como los tres campos separados. Se aceptan ambas para no
 * atar el frontend a cómo el caso guarde ese contenido en disco.
 */
function normalizeExplanation(value: unknown): ChallengeExplanation | null {
  if (typeof value === "string") {
    const texto = value.trim();
    return texto === "" ? null : { formato: "markdown", texto };
  }

  const fields = readRecord(value);
  if (typeof fields.causaRaiz !== "string") return null;

  return {
    formato: "campos",
    campos: {
      causaRaiz: readString(fields.causaRaiz),
      razonamiento: readString(fields.razonamiento),
      conceptoTransferible: readString(fields.conceptoTransferible),
    },
  };
}

/* -------------------------------- normalize -------------------------------- */

/**
 * Lleva cualquier variante del JSON a una única forma.
 *
 * Absorbe dos diferencias entre casos:
 * - `archivoEditable` (objeto singular) vs `archivosEditables` (array).
 * - Campos que un caso embebe y otro no (`pistas`, `explicacionFinal`,
 *   `contenidoInicial`): se devuelven vacíos o `null` en vez de romper, y la
 *   interfaz muestra un estado explícito.
 *
 * A partir de aquí nadie más vuelve a mirar los nombres crudos del JSON.
 */
export function normalize(raw: RawChallenge): NormalizedChallenge {
  const reporte = readRecord(raw.reporte);
  const arquitectura = readRecord(raw.arquitectura);

  const rawEditables = Array.isArray(raw.archivosEditables)
    ? raw.archivosEditables
    : [raw.archivoEditable];

  const editableFiles: EditableFile[] = rawEditables
    .map(readRecord)
    .filter((file) => typeof file.ruta === "string")
    .map((file) => ({
      ruta: readString(file.ruta),
      contenidoInicial: readString(file.contenidoInicial),
    }));

  const componentes: ArchitectureNode[] = readArray(arquitectura.componentes)
    .map(readRecord)
    .map((node) => ({
      nombre: readString(node.nombre),
      descripcion: readString(node.descripcion),
    }))
    .filter((node) => node.nombre !== "");

  const pistas: Hint[] = readArray(raw.pistas)
    .map(readRecord)
    .filter((hint) => typeof hint.texto === "string")
    .map((hint, index) => ({
      nivel: typeof hint.nivel === "number" ? hint.nivel : index + 1,
      texto: readString(hint.texto),
    }))
    .sort((a, b) => a.nivel - b.nivel);

  const explicacionFinal = normalizeExplanation(raw.explicacionFinal);

  return {
    id: readString(raw.id),
    titulo: readString(raw.titulo),
    nivel: readString(raw.nivel),
    aprendizajePrincipal: readString(raw.aprendizajePrincipal),
    reporte: {
      sintoma: readString(reporte.sintoma),
      comportamientoEsperado: readString(reporte.comportamientoEsperado),
      pasosParaReproducir: readStringArray(reporte.pasosParaReproducir),
    },
    arquitectura: {
      componentes,
      flujo: readString(arquitectura.flujo),
    },
    arbolArchivos: readStringArray(raw.arbolArchivos),
    editableFiles,
    pistas,
    explicacionFinal,
  };
}

/* ---------------------------------- Hook ---------------------------------- */

export type LoaderStatus = "loading" | "ready" | "error";

export interface ChallengeLoaderState {
  status: LoaderStatus;
  challenge: NormalizedChallenge | null;
  error: string | null;
}

export function useChallengeLoader(caseId: string): ChallengeLoaderState {
  const [state, setState] = useState<ChallengeLoaderState>({
    status: "loading",
    challenge: null,
    error: null,
  });

  useEffect(() => {
    let active = true;
    setState({ status: "loading", challenge: null, error: null });

    fetchChallenge(caseId)
      .then((raw) => {
        if (!active) return;
        setState({ status: "ready", challenge: normalize(raw), error: null });
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setState({
          status: "error",
          challenge: null,
          error: cause instanceof Error ? cause.message : null,
        });
      });

    return () => {
      active = false;
    };
  }, [caseId]);

  return state;
}
