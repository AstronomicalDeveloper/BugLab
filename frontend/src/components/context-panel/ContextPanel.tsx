import { useState } from "react";
import type { Challenge } from "../../types";
import { cn } from "../../lib/cn";
import { BugReportTab } from "./BugReportTab";
import { ArchitectureTab } from "./ArchitectureTab";
import { ProgressiveHintsTab } from "./ProgressiveHintsTab";
import { FinalExplanationTab } from "./FinalExplanationTab";

type ContextTabId = "reporte" | "arquitectura" | "pistas" | "explicacion";

const tabs: { id: ContextTabId; label: string }[] = [
  { id: "reporte", label: "Reporte" },
  { id: "arquitectura", label: "Arquitectura" },
  { id: "pistas", label: "Pistas" },
  { id: "explicacion", label: "Explicación" },
];

export interface ContextPanelProps {
  challenge: Challenge;
  isSolved: boolean;
}

export function ContextPanel({ challenge, isSolved }: ContextPanelProps) {
  const [tab, setTab] = useState<ContextTabId>("reporte");

  return (
    <section
      aria-label="Contexto e investigación"
      className="flex h-full w-full flex-col overflow-hidden border-b border-line bg-panel lg:w-[30%] lg:border-b-0 lg:border-r"
    >
      <div role="tablist" aria-label="Secciones del caso" className="flex flex-none border-b border-line px-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "border-b-2 px-3 py-2.5 font-mono text-xs font-medium transition-colors",
              tab === t.id
                ? "border-accent text-ink"
                : "border-transparent text-ink-muted hover:text-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tab === "reporte" && <BugReportTab report={challenge.report} />}
        {tab === "arquitectura" && <ArchitectureTab architecture={challenge.architecture} />}
        {tab === "pistas" && <ProgressiveHintsTab key={challenge.id} hints={challenge.hints} />}
        {tab === "explicacion" && (
          <FinalExplanationTab explanation={challenge.finalExplanation} locked={!isSolved} />
        )}
      </div>
    </section>
  );
}
