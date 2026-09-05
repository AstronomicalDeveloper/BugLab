import type { FileNode } from "../../types";
import { FileTreeItem } from "./FileTreeItem";

export interface FileTreeProps {
  nodes: FileNode[];
  activeFileId: string | null;
  onSelect: (fileId: string) => void;
}

export function FileTree({ nodes, activeFileId, onSelect }: FileTreeProps) {
  return (
    <nav aria-label="Árbol de archivos" className="flex h-full w-full flex-col gap-0.5 overflow-y-auto p-2">
      {nodes.map((node) => (
        <FileTreeItem key={node.id} node={node} depth={0} activeFileId={activeFileId} onSelect={onSelect} />
      ))}
    </nav>
  );
}
