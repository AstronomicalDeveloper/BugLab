export interface ResetButtonProps {
  onReset: () => void;
  disabled?: boolean;
}

export function ResetButton({ onReset, disabled }: ResetButtonProps) {
  return (
    <button
      type="button"
      onClick={onReset}
      disabled={disabled}
      className="rounded-md border border-line px-3 py-1.5 font-mono text-xs font-medium text-ink-muted transition-colors hover:border-error/50 hover:text-error disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink-muted"
    >
      ↺ Reiniciar caso
    </button>
  );
}
