import type { ErrorDiff, TestCase } from "../../types";
import { TestActionHeader } from "./TestActionHeader";
import { TestResultCard } from "./TestResultCard";
import { ErrorDiffView } from "./ErrorDiffView";

export interface TestRunnerPanelProps {
  tests: TestCase[];
  onRunTests: () => void;
  isRunning: boolean;
  errorDiff?: ErrorDiff | null;
}

export function TestRunnerPanel({ tests, onRunTests, isRunning, errorDiff }: TestRunnerPanelProps) {
  const passed = tests.filter((t) => t.passed === true).length;

  return (
    <section
      aria-label="Validador y pruebas"
      className="flex h-full w-full flex-col overflow-hidden bg-panel lg:w-[30%]"
    >
      <TestActionHeader onRun={onRunTests} isRunning={isRunning} passed={passed} total={tests.length} />

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-2">
          {tests.map((test) => (
            <TestResultCard key={test.id} test={test} />
          ))}
        </div>

        {errorDiff && (
          <div className="mt-4">
            <ErrorDiffView diff={errorDiff} />
          </div>
        )}
      </div>
    </section>
  );
}
