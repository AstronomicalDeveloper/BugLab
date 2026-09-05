import type { FileNode } from "../types";

export function flattenFiles(nodes: FileNode[]): FileNode[] {
  return nodes.flatMap((node) => (node.kind === "folder" ? flattenFiles(node.children ?? []) : [node]));
}
