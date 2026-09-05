import type { EditorTab } from "../../types";
import { cn } from "../../lib/cn";

export interface EditorTabsProps {
  tabs: EditorTab[];
  activeTabId: string | null;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
}

export function EditorTabs({ tabs, activeTabId, onSelectTab, onCloseTab }: EditorTabsProps) {
  return (
    <div role="tablist" aria-label="Archivos abiertos" className="flex flex-none overflow-x-auto border-b border-line bg-panel">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            className={cn(
              "group flex items-center gap-2 border-r border-line px-3 py-2 font-mono text-xs whitespace-nowrap",
              isActive ? "bg-canvas text-ink" : "text-ink-muted hover:text-ink",
            )}
          >
            <button type="button" onClick={() => onSelectTab(tab.id)} className="flex items-center gap-1.5">
              {tab.fileName}
              {tab.isDirty && <span className="h-1.5 w-1.5 rounded-full bg-warning" aria-label="Sin guardar" />}
            </button>
            <button
              type="button"
              onClick={() => onCloseTab(tab.id)}
              aria-label={`Cerrar ${tab.fileName}`}
              className="text-ink-muted opacity-0 transition-opacity hover:text-error group-hover:opacity-100"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
