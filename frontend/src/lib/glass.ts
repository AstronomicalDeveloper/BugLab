/**
 * Los 3 niveles de vidrio de la Propuesta §15. Las reglas viven en
 * src/index.css (.glass-1/2/3); acá solo se resuelve el nombre de la clase,
 * para que ningún componente invente su propio fondo, blur o sombra.
 *
 * 1 — navegación y modales   (el vidrio más perceptible)
 * 2 — paneles y tarjetas     (vidrio medio)
 * 3 — código y resultados    (casi sólido: la legibilidad gana)
 *
 * Vive en lib/ y no en un archivo de componente a propósito: así los archivos
 * .tsx exportan solo componentes y react-refresh no se queja.
 */

export type GlassLevel = 1 | 2 | 3;

export function glassClass(level: GlassLevel): string {
  return level === 1 ? "glass-1" : level === 2 ? "glass-2" : "glass-3";
}
