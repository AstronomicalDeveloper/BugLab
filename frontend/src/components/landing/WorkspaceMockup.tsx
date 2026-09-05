import { IconLock } from "../../lib/icons";
import { cn } from "../../lib/cn";

/**
 * Recreación estática de la pantalla del desafío, con las tres zonas reales:
 * archivos y pistas a la izquierda, el trabajo al centro, el contexto del caso
 * a la derecha.
 *
 * El contenido es el de BUG-002 tal como lo sirve el backend
 * (`backend/challenges/BUG-002/`): mismos archivos, mismo código semilla,
 * mismos nombres de test y mismo reporte. Si ese caso cambia, esto queda
 * desactualizado y hay que reflejarlo acá.
 *
 * No es interactiva y no comparte código con la pantalla real. Además de
 * mostrar el producto, deja ver los tres niveles de vidrio (§15) juntos:
 * los paneles laterales en nivel 2, el editor y las pruebas en nivel 3.
 */

type TokenKind = "kw" | "str" | "fn" | "punct" | "plain";

const tokenClass: Record<TokenKind, string> = {
  kw: "text-accent",
  str: "text-cyan",
  fn: "text-action",
  punct: "text-ink-muted",
  plain: "text-ink/90",
};

type Token = [string, TokenKind];

/** Fragmento del archivo editable real `src/pages/RegisterPage.jsx`. */
const codeLines: Token[][] = [
  [["export default function ", "kw"], ["RegisterPage", "fn"], ["({ onValidation }) {", "punct"]],
  [["  const", "kw"], [" [isOpen, setIsOpen] = ", "plain"], ["useState", "fn"], ["(false);", "punct"]],
  [["  return", "kw"], [" (", "punct"]],
  [["    <div>", "punct"]],
  [["      <button onClick={() => setIsOpen(!isOpen)}>", "punct"]],
  [["        {isOpen ? ", "plain"], ['"Cerrar formulario"', "str"], [" : ", "plain"], ['"Abrir formulario"', "str"], ["}", "punct"]],
  [["      </button>", "punct"]],
  [["      <div style={{ display: isOpen ? ", "punct"], ['"block"', "str"], [" : ", "plain"], ['"none"', "str"], [" }}>", "punct"]],
  [["        <RegisterForm onValidation={onValidation} />", "punct"]],
  [["      </div>", "punct"]],
  [["    </div>", "punct"]],
  [["  );", "punct"]],
  [["}", "punct"]],
];

interface FileEntry {
  path: string;
  editable?: boolean;
  readonly?: boolean;
}

/** `arbolArchivos` de BUG-002. El editable es el único que se abre. */
const files: FileEntry[] = [
  { path: "src/pages/RegisterPage.jsx", editable: true },
  { path: "src/components/RegisterForm.jsx", readonly: true },
];

/** Los siete tests reales del caso. Con el bug intacto, pasan tres. */
const tests = [
  { name: "No monta el formulario mientras está cerrado", passed: false },
  { name: "No ejecuta validación mientras está cerrado", passed: false },
  { name: "Monta el formulario al abrirlo", passed: true },
  { name: "No muestra errores en el primer montaje", passed: true },
  { name: "Muestra errores después de enviar", passed: true },
  { name: "Desmonta el formulario al cerrarlo", passed: false },
  { name: "Detiene la validación después de desmontarlo", passed: false },
];

const passedCount = tests.filter((test) => test.passed).length;

/** `arquitectura.flujo` de BUG-002. */
const flow = ["RegisterPage", "montaje condicional", "RegisterForm", "useEffect"];

export function WorkspaceMockup() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16">
        <h2 className="max-w-[18ch] text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
          Todo el caso cabe en una pantalla
        </h2>
        <p className="max-w-[54ch] text-sm leading-relaxed text-ink-muted">
          Los archivos y las pistas a un lado, el reporte y la arquitectura al
          otro, y el editor con las pruebas al centro. Investigas sin perder el
          hilo saltando entre pestañas, y sin montar un entorno de desarrollo
          para empezar.
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
              <span className="text-ink">BUG-002</span> · El formulario
              oculto sigue validando
            </p>
            <span className="hidden shrink-0 rounded-full border border-warning/40 px-2 py-0.5 font-mono text-[10px] text-warning sm:block">
              Intermedio
            </span>
            <span className="shrink-0 font-mono text-[10px] text-ink-muted">
              {passedCount}/{tests.length} tests
            </span>
          </div>

          <div
            className="flex min-h-[21rem] flex-col lg:flex-row"
            aria-hidden="true"
          >
            {/* Izquierda — archivos y pistas. Vidrio nivel 2. */}
            <div className="glass-2 hidden w-56 shrink-0 flex-col gap-4 rounded-none border-y-0 border-l-0 p-3.5 lg:flex">
              <div>
                <p className="mb-2.5 font-mono text-[10px] tracking-wide text-ink-muted">
                  ARCHIVOS DEL CASO
                </p>
                <ul className="space-y-0.5">
                  {files.map((file) => (
                    <li key={file.path}>
                      <span
                        className={cn(
                          "flex items-center gap-1.5 rounded px-1.5 py-1 font-mono text-[10.5px]",
                          file.editable
                            ? "border border-accent/35 bg-accent/12 text-accent-soft"
                            : "text-ink/70",
                        )}
                      >
                        <span className="truncate">{file.path}</span>
                        {file.readonly && (
                          <IconLock className="h-3 w-3 shrink-0 opacity-50" />
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-line pt-3.5">
                <p className="mb-2 font-mono text-[10px] tracking-wide text-ink-muted">
                  PISTAS
                </p>
                <p className="text-[11.5px] leading-relaxed text-ink-muted">
                  Intenta encontrar la causa por tu cuenta primero.
                </p>
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-ink-muted">
                    0/3 usadas
                  </span>
                  <span className="rounded-md border border-accent/40 bg-accent/12 px-2 py-1 font-mono text-[10px] text-accent-soft">
                    Ver pista
                  </span>
                </div>
              </div>
            </div>

            {/* Centro — editor y pruebas. Vidrio nivel 3, casi sólido. */}
            <div className="glass-3 flex min-w-0 flex-1 flex-col rounded-none border-y-0">
              <div className="flex items-center gap-1 border-b border-line px-2 pt-2">
                <span className="flex items-center gap-2 rounded-t border border-b-0 border-line bg-panel/60 px-3 py-1.5 font-mono text-[11px] text-ink">
                  RegisterPage.jsx
                </span>
              </div>

              <div className="overflow-x-auto p-3">
                <pre className="font-mono text-[11px] leading-[1.6]">
                  <code>
                    {codeLines.map((tokens, index) => (
                      <div key={index} className="flex">
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

              <div className="mt-auto border-t border-line px-3 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-md border border-action/60 bg-action px-3 py-1.5 font-mono text-[11px] font-medium text-[#0c1220]">
                    Ejecutar tests
                  </span>
                  <span className="font-mono text-[11px] text-ink-muted">
                    <span className="text-error">
                      {passedCount}/{tests.length}
                    </span>{" "}
                    pruebas superadas
                  </span>
                </div>

                <ul className="mt-3 space-y-1.5">
                  {tests.map((test) => (
                    <li
                      key={test.name}
                      className={cn(
                        "flex items-center gap-2 rounded-md border px-3 py-2 font-mono text-[11px]",
                        test.passed
                          ? "border-success/35 bg-success/10 text-success"
                          : "border-error/35 bg-error/10 text-error",
                      )}
                    >
                      <span>{test.passed ? "✓" : "✕"}</span>
                      <span className="truncate">{test.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Derecha — reporte y arquitectura. Vidrio nivel 2. */}
            <div className="glass-2 hidden w-72 shrink-0 flex-col gap-4 rounded-none border-y-0 border-r-0 p-4 lg:flex">
              <div>
                <p className="mb-2.5 font-mono text-[10px] tracking-wide text-ink-muted">
                  REPORTE
                </p>
                <p className="text-[11px] font-semibold text-ink">Síntoma</p>
                <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">
                  Aunque el formulario está cerrado, permanece montado y su
                  efecto de validación se ejecuta en segundo plano.
                </p>

                <p className="mt-3 text-[11px] font-semibold text-ink">
                  Comportamiento esperado
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">
                  Al cerrar, el formulario debe desmontarse y limpiar sus
                  efectos. Los errores solo aparecen después del envío.
                </p>
              </div>

              <div className="border-t border-line pt-3.5">
                <p className="mb-2.5 font-mono text-[10px] tracking-wide text-ink-muted">
                  ARQUITECTURA
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {flow.map((node, index) => (
                    <span key={node} className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "rounded border px-2 py-1 font-mono text-[10px]",
                          index === flow.length - 1
                            ? "border-accent/45 bg-accent/12 text-accent-soft"
                            : "border-line bg-white/[0.04] text-ink-muted",
                        )}
                      >
                        {node}
                      </span>
                      {index < flow.length - 1 && (
                        <span className="text-[10px] text-ink-muted/60">→</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <figcaption className="mt-4 text-center text-xs text-ink-muted">
          BUG-002 en curso, con el código y las siete pruebas reales del caso:
          tres pasan con el bug inicial.
        </figcaption>
      </figure>
    </section>
  );
}
