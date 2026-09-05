import type { ToastItem, ToastVariant } from "../../types";
import { cn } from "../../lib/cn";

const variantConfig: Record<ToastVariant, { icon: string; border: string; text: string }> = {
  success: { icon: "✓", border: "border-success/40", text: "text-success" },
  error: { icon: "✕", border: "border-error/40", text: "text-error" },
  warning: { icon: "⚠", border: "border-warning/40", text: "text-warning" },
  info: { icon: "ℹ", border: "border-accent/40", text: "text-accent" },
};

export interface ToastNotificationProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

export function ToastNotification({ toast, onDismiss }: ToastNotificationProps) {
  const config = variantConfig[toast.variant];

  return (
    <div
      role="status"
      className={cn(
        "flex items-center gap-3 rounded-md border bg-panel px-4 py-3 shadow-lg",
        config.border,
      )}
    >
      <span className={cn("font-mono text-sm", config.text)} aria-hidden="true">
        {config.icon}
      </span>
      <span className="flex-1 text-sm text-ink">{toast.message}</span>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Cerrar notificación"
        className="text-ink-muted hover:text-ink"
      >
        ×
      </button>
    </div>
  );
}
