interface ExecuteButtonProps {
  onClick: () => void;
  isRunning: boolean;
  disabled?: boolean;
}

export default function ExecuteButton({
  onClick,
  isRunning,
  disabled = false,
}: ExecuteButtonProps) {
  return (
    <button
      type="button"
      className="challenge-button challenge-button--primary"
      onClick={onClick}
      disabled={disabled || isRunning}
    >
      {isRunning && <span className="challenge-spinner" aria-hidden="true" />}
      {isRunning ? "Ejecutando tests" : "Ejecutar tests"}
    </button>
  );
}
