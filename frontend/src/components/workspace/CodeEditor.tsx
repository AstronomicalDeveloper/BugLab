export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  /** Solo para mostrar un tag informativo — la sandbox de lenguaje/highlight real la agrega tu compañero si hace falta. */
  language?: string;
}

export function CodeEditor({ value, onChange, readOnly, language = "JavaScript" }: CodeEditorProps) {
  const lineCount = value.split("\n").length;

  return (
    <div className="flex h-full flex-1 overflow-hidden bg-canvas">
      <div
        aria-hidden="true"
        className="flex-none select-none overflow-hidden py-3 text-right font-mono text-xs leading-6 text-ink-muted/50"
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i} className="px-3">
            {i + 1}
          </div>
        ))}
      </div>
      <div className="relative flex-1">
        <span className="absolute right-3 top-2 rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">
          {language}
        </span>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          spellCheck={false}
          aria-label="Editor de código"
          className="h-full w-full resize-none bg-transparent py-3 pr-3 font-mono text-xs leading-6 text-ink outline-none disabled:opacity-60"
        />
      </div>
    </div>
  );
}
