import { useSyncExternalStore } from "react";
import { readProgress, type ProgressMap } from "../lib/progress";

/**
 * Lee el progreso local (Propuesta §13). useSyncExternalStore mantiene la UI
 * en sincronía si el progreso cambia en otra pestaña.
 *
 * El snapshot se cachea porque readProgress() devuelve un objeto nuevo en cada
 * llamada y React entraría en un bucle infinito comparando por identidad.
 */

let cached: ProgressMap = readProgress();

function subscribe(onChange: () => void): () => void {
  function handleStorage(event: StorageEvent) {
    if (event.key !== null && !event.key.startsWith("buglab.progress")) return;
    cached = readProgress();
    onChange();
  }

  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}

function getSnapshot(): ProgressMap {
  return cached;
}

/** En SSR/prerender no hay localStorage: se devuelve un mapa vacío estable. */
const emptyProgress: ProgressMap = {};
function getServerSnapshot(): ProgressMap {
  return emptyProgress;
}

export function useProgress(): ProgressMap {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
