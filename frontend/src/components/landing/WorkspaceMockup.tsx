import { IconLock } from "../../lib/icons";
import { cn } from "../../lib/cn";

/**
 * Recreación estática de la pantalla principal del desafío (Propuesta §4):
 * Explorador + Editor + Panel del caso, con la franja de pruebas abajo.
 *
 * No es interactiva y no comparte código con el workspace real. Cumple dos
 * funciones: mostrar el producto en uso y dejar ver los tres niveles de
 * vidrio (§15) trabajando juntos — explorador y panel del caso en nivel 2,
 * editor y pruebas en nivel 3.
 */

type TokenKind = "kw" | "str" | "fn" | "com" | "punct" | "plain";

const tokenClass: Record<TokenKind, string> = {
  kw: "text-accent",
  str: "text-cyan",
  fn: "text-action",
  com: "text-ink-muted/60",
  punct: "text-ink-muted",
  plain: "text-ink/90",
};

type Token = [string, TokenKind];

const codeLines: Token[][] = [
  [["import", "kw"], [" { useEffect } ", "plain"], ["from", "kw"], [' "react"', "str"], [";", "punct"]],
  [["import", "kw"], [" { useProductForm } ", "plain"], ["from", "kw"], [' "../hooks"', "str"], [";", "punct"]],
  [],
  [["export function ", "kw"], ["ProductForm", "fn"], ["({ visible }) {", "punct"]],
  [["  const", "kw"], [" { values, validate, errors } ", "plain"], ["=", "punct"], [" useProductForm", "fn"], ["();", "punct"]],
  [],
  [["  useEffect", "fn"], ["(() ", "punct"], ["=>", "kw"], [" {", "punct"]],
  [["    validate", "fn"], ["(values);", "punct"]],
  [["  }, []);", "punct"]],
  [],
  [["  return", "kw"], [" (", "punct"]],
  [["    <form ", "punct"], ["hidden", "fn"], ["={!visible}>", "punct"]],
  [["      {errors.name ", "plain"], ["&&", "kw"], [" <span>{errors.name}</span>}", "plain"]],
  [["    </form>", "punct"]],
  [["  );", "punct"]],
  [["}", "punct"]],
];

/** Línea que el estudiante acaba investigando. Se marca, no se explica. */
const suspectLine = 9;

interface TreeEntry {
  label: string;
  depth: number;
  kind: "folder" | "file";
  active?: boolean;
  readonly?: boolean;
}

const fileTree: TreeEntry[] = [
  { label: "src", depth: 0, kind: "folder" },
  { label: "components", depth: 1, kind: "folder" },
  { label: "ProductPage.jsx", depth: 2, kind: "file" },
  { label: "ProductModal.jsx", depth: 2, kind: "file" },
  { label: "ProductForm.jsx", depth: 2, kind: "file", active: true },
  { label: "hooks", depth: 1, kind: "folder" },
  { label: "useProductForm.js", depth: 2, kind: "file" },
  { label: "tests", depth: 0, kind: "folder" },
  { label: "ProductForm.test.jsx", depth: 1, kind: "file", readonly: true },
];

/** Los cinco tests del resultado parcial de la Propuesta §9. */
const testRows = [
  { name: "El modal comienza cerrado", passed: true },
  { name: "El formulario acepta datos válidos", passed: true },
  { name: "No debe mostrar errores antes de abrirse", passed: false },
  { name: "La validación ocurre demasiado pronto", passed: false },
  { name: "El envío funciona correctamente", passed: true },
];

const passedCount = testRows.filter((test) => test.passed).length;

export function WorkspaceMockup() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16">
        <h2 className="max-w-[18ch] text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
          Todo el caso cabe en una pantalla
        </h2>
        <p className="max-w-[54ch] text-sm leading-relaxed text-ink-muted">
          El reporte, la arquitectura, los archivos, el editor y las pruebas
          conviven en el mismo espacio. Investigas sin perder el hilo saltando
          entre pestañas, y sin montar un entorno de desarrollo para empezar.
        </p>
      </div>

      <figure className="mt-10">
        <div className="glass-1 overflow-hidden rounded-2xl">
          {/* Barra de la ventana */}
          <div className="flex items-center gap-3 border-b border-line px-4 py-3">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-error/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
            </span>
            <p className="min-w-0 flex-1 truncate font-mono text-[11px] text-ink-muted">
              <span className="text-ink">BUG-002</span> · El formulario se
              valida antes de abrirse
            </p>
            <span className="hidden shrink-0 rounded-full border border-warning/40 px-2 py-0.5 font-mono text-[10px] text-warning sm:block">
              Intermedio
            </span>
            <span className="shrink-0 font-mono text-[10px] text-ink-muted">
              {passedCount}/{testRows.length} tests
            </span>
          </div>

          {/* Explorador · Editor · Panel del caso */}
          <div
            className="flex min-h-[19rem] flex-col lg:flex-row"
            aria-hidden="true"
          >
            {/* Explorador — vidrio nivel 2 */}
            <div className="glass-2 hidden w-52 shrink-0 rounded-none border-y-0 border-l-0 p-3 lg:block">
              <p className="mb-3 font-mono text-[10px] tracking-wide text-ink-muted">
                EXPLORADOR
              </p>
              <ul className="space-y-0.5">
                {fileTree.map((entry) => (
                  <li key={entry.label}>
                    <span
                      style={{ paddingLeft: entry.depth * 12 }}
                      className={cn(
                        "flex items-center gap-1.5 rounded px-1.5 py-1 font-mono text-[11px]",
                        entry.active
                          ? "bg-accent/12 text-accent-soft"
                          : entry.kind === "folder"
                            ? "text-ink-muted"
                            : "text-ink/75",
                      )}
                    >
                      {entry.kind === "folder" && (
                        <span className="text-[8px] opacity-70">▼</span>
                      )}
                      <span className="truncate">{entry.label}</span>
                      {entry.readonly && (
                        <IconLock className="h-3 w-3 shrink-0 opacity-50" />
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Editor — vidrio nivel 3, casi sólido */}
            <div className="glass-3 flex min-w-0 flex-1 flex-col rounded-none border-y-0">
              <div className="flex items-center gap-1 border-b border-line px-2 pt-2">
                <span className="flex items-center gap-2 rounded-t border border-b-0 border-line bg-panel/60 px-3 py-1.5 font-mono text-[11px] text-ink">
                  ProductForm.jsx
                  <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                </span>
                <span className="px-3 py-1.5 font-mono text-[11px] text-ink-muted">
                  useProductForm.js
                </span>
              </div>

              <div className="flex-1 overflow-x-auto p-3">
                <pre className="font-mono text-[11px] leading-[1.65]">
                  <code>
                    {codeLines.map((tokens, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex",
                          index + 1 === suspectLine &&
                            "-mx-3 border-l-2 border-error/60 bg-error/8 px-3",
                        )}
                      >
                        <span className="w-7 shrink-0 pr-3 text-right text-ink-muted/45 select-none">
                          {index + 1}
                        </span>
                        <span className="whitespace-pre">
                          {tokens.map(([text, kind], tokenIndex) => (
                            <span key={tokenIndex} className={tokenClass[kind]}>
                              {text}
                            </span>
                          ))}
                        </span>
                      </div>
                    ))}
                  </code>
                </pre>
              </div>
            </div>

            {/* Panel del caso — vidrio nivel 2 */}
            <div className="glass-2 hidden w-72 shrink-0 rounded-none border-y-0 border-r-0 p-4 lg:block">
              <div className="flex gap-1">
                <span className="rounded border border-accent/40 bg-accent/12 px-2 py-1 font-mono text-[10px] text-accent-soft">
                  Reporte
                </span>
                <span className="px-2 py-1 font-mono text-[10px] text-ink-muted">
                  Arquitectura
                </span>
                <span className="px-2 py-1 font-mono text-[10px] text-ink-muted">
                  Pistas
                </span>
              </div>

              <p className="mt-5 font-mono text-[10px] text-error">SÍNTOMA</p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink/85">
                El formulario muestra mensajes de validación antes de que el
                usuario lo haya abierto.
              </p>

              <p className="mt-5 font-mono text-[10px] text-success">
                COMPORTAMIENTO ESPERADO
              </p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink/85">
                Los errores solo deben aparecer cuando corresponda según la
                interacción definida.
              </p>

              <p className="mt-5 border-l-2 border-accent bg-accent/5 py-2 pl-3 text-[12.5px] leading-relaxed text-ink-muted italic">
                Abro la ficha del producto y ya me aparece todo en rojo.
              </p>
            </div>
          </div>

          {/* Panel de pruebas — vidrio nivel 3 */}
          <div
            className="glass-3 rounded-none border-x-0 border-b-0 px-4 py-3"
            aria-hidden="true"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-[11px] text-ink-muted">
                <span className="text-ink">
                  {passedCount} / {testRows.length}
                </span>{" "}
                pruebas superadas
              </p>
              <span className="rounded-md border border-action/60 bg-action px-3 py-1.5 font-mono text-[11px] font-medium text-[#0c1220]">
                Ejecutar tests
              </span>
            </div>

            <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
              {testRows.map((test) => (
                <li
                  key={test.name}
                  className="flex items-center gap-2 font-mono text-[11px]"
                >
                  <span
                    className={test.passed ? "text-success" : "text-error"}
                  >
                    {test.passed ? "✓" : "✕"}
                  </span>
                  <span className="truncate text-ink-muted">{test.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <figcaption className="mt-4 text-center text-xs text-ink-muted">
          BUG-002 en curso: el explorador y el panel del caso a los lados, el
          editor y las pruebas al centro.
        </figcaption>
      </figure>
    </section>
  );
}
