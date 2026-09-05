import type { ChallengeStatus, ChallengeSummary } from "../../types";
import { ChallengeSelector } from "./ChallengeSelector";
import { ProgressBadge } from "./ProgressBadge";
import { ResetButton } from "./ResetButton";

export interface TopNavbarProps {
  version?: string;
  challenges: ChallengeSummary[];
  selectedChallengeId: string;
  onSelectChallenge: (id: string) => void;
  status: ChallengeStatus;
  resolvedCount: number;
  totalCount: number;
  onReset: () => void;
}

export function TopNavbar({
  version = "MVP v1.0",
  challenges,
  selectedChallengeId,
  onSelectChallenge,
  status,
  resolvedCount,
  totalCount,
  onReset,
}: TopNavbarProps) {
  return (
    <header className="flex h-14 flex-none items-center justify-between gap-4 border-b border-line bg-panel px-4">
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm font-semibold tracking-tight text-ink">
          Bug<span className="text-accent">Lab</span>
        </span>
        <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">
          {version}
        </span>
      </div>

      <div className="hidden flex-1 justify-center md:flex">
        <ChallengeSelector
          challenges={challenges}
          selectedChallengeId={selectedChallengeId}
          onSelect={onSelectChallenge}
        />
      </div>

      <div className="hidden lg:block">
        <ProgressBadge status={status} />
      </div>

      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-ink-muted">
          {resolvedCount}/{totalCount} Resueltos
        </span>
        <ResetButton onReset={onReset} />
      </div>
    </header>
  );
}
