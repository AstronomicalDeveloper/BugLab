export interface CompletionModalProps {
  open: boolean;
  challengeTitle: string;
  onClose: () => void;
  onNextChallenge?: () => void;
}

export function CompletionModal({ open, challengeTitle, onClose, onNextChallenge }: CompletionModalProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="completion-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/70 p-4"
    >
      <div className="w-full max-w-sm rounded-lg border border-success/40 bg-panel p-6 text-center shadow-xl">
        <p aria-hidden="true" className="mb-3 text-4xl">
          🎉
        </p>
        <h2 id="completion-modal-title" className="text-lg font-semibold text-ink">
          Caso resuelto
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          Todos los tests de <span className="text-ink">{challengeTitle}</span> están en verde.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          {onNextChallenge && (
            <button
              type="button"
              onClick={onNextChallenge}
              className="rounded-md bg-accent px-4 py-2 font-mono text-xs font-semibold text-canvas hover:opacity-90"
            >
              Siguiente reto →
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-line px-4 py-2 font-mono text-xs text-ink-muted hover:text-ink"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
