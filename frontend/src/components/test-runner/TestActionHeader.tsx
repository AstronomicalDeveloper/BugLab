export interface TestActionHeaderProps {
  onRun: () => void;
  isRunning: boolean;
  passed: number;
  total: number;
}

export function TestActionHeader({ onRun, isRunning, passed, total }: TestActionHeaderProps) {
  return (
    <div className="flex flex-none flex-col gap-3 border-b border-line p-4">
      <button
        type="button"
        onClick={onRun}
        disabled={isRunning}
        className="flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 font-mono text-xs font-semibold text-canvas transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isRunning ? (
          <>
            <span
              aria-hidden="true"
              className="h-3 w-3 animate-spin rounded-full border-2 border-canvas/40 border-t-canvas"
            />
            Ejecutando…
          </>
        ) : (
          "[ Ejecutar Tests ]"
        )}
      </button>

      <div className="flex items-center justify-between font-mono text-xs">
        <span className="text-ink-muted">Resultado</span>
        <span className={passed === total && total > 0 ? "font-semibold text-success" : "text-ink"}>
          {passed}/{total} pruebas superadas
        </span>
      </div>
    </div>
  );
}
