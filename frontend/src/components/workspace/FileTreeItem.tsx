import type { FileNode } from "../../types";
import { cn } from "../../lib/cn";

export interface FileTreeItemProps {
  node: FileNode;
  depth: number;
  activeFileId: string | null;
  onSelect: (fileId: string) => void;
}

export function FileTreeItem({ node, depth, activeFileId, onSelect }: FileTreeItemProps) {
  const isFolder = node.kind === "folder";
  const isActive = !isFolder && node.id === activeFileId;
  const isReadonly = node.access === "readonly";

  return (
    <div>
      <button
        type="button"
        disabled={isFolder}
        onClick={() => onSelect(node.id)}
        title={isReadonly ? `${node.name} (solo lectura)` : node.name}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
        className={cn(
          "flex w-full items-center gap-2 rounded px-2 py-1 text-left font-mono text-xs transition-colors",
          isFolder
            ? "cursor-default font-semibold text-ink-muted"
            : isActive
              ? "bg-accent/10 text-accent"
              : "text-ink-muted hover:bg-canvas/60 hover:text-ink",
        )}
      >
        <span aria-hidden="true">{isFolder ? "📁" : "📄"}</span>
        <span className="flex-1 truncate">{node.name}</span>
        {isReadonly && (
          <span aria-hidden="true" title="Solo lectura">
            🔒
          </span>
        )}
      </button>

      {isFolder &&
        node.children?.map((child) => (
          <FileTreeItem
            key={child.id}
            node={child}
            depth={depth + 1}
            activeFileId={activeFileId}
            onSelect={onSelect}
          />
        ))}
    </div>
  );
}
