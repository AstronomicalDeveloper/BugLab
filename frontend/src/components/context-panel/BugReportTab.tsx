import type { BugReport } from "../../types";

export interface BugReportTabProps {
  report: BugReport;
}

export function BugReportTab({ report }: BugReportTabProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border border-line bg-canvas/40 p-4">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-error">
          // síntoma reportado
        </p>
        <p className="text-sm leading-relaxed text-ink">{report.symptom}</p>
      </div>

      <div className="rounded-md border border-line bg-canvas/40 p-4">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-success">
          // comportamiento esperado
        </p>
        <p className="text-sm leading-relaxed text-ink">{report.expectedBehavior}</p>
      </div>

      <blockquote className="rounded-r-md border-l-2 border-accent bg-accent/5 px-4 py-3">
        <p className="text-sm italic leading-relaxed text-ink-muted">{report.quote}</p>
        <cite className="mt-2 block font-mono text-[11px] not-italic text-ink-muted/70">
          Reportado por: {report.reportedBy}
        </cite>
      </blockquote>
    </div>
  );
}
