import type { EditorTab, FileNode } from "../../types";
import { FileTree } from "./FileTree";
import { EditorTabs } from "./EditorTabs";
import { CodeEditor } from "./CodeEditor";

export interface WorkspacePanelProps {
  files: FileNode[];
  openTabs: EditorTab[];
  activeFileId: string | null;
  fileContents: Record<string, string>;
  readonlyFileIds?: string[];
  onSelectFile: (fileId: string) => void;
  onCloseTab: (fileId: string) => void;
  onChangeContent: (fileId: string, content: string) => void;
}

export function WorkspacePanel({
  files,
  openTabs,
  activeFileId,
  fileContents,
  readonlyFileIds = [],
  onSelectFile,
  onCloseTab,
  onChangeContent,
}: WorkspacePanelProps) {
  return (
    <section
      aria-label="Espacio de trabajo"
      className="flex h-full w-full flex-col overflow-hidden border-b border-line bg-canvas lg:w-[40%] lg:flex-row lg:border-b-0 lg:border-r"
    >
      <div className="h-40 flex-none border-b border-line bg-panel lg:h-full lg:w-48 lg:flex-none lg:border-b-0 lg:border-r">
        <FileTree nodes={files} activeFileId={activeFileId} onSelect={onSelectFile} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <EditorTabs
          tabs={openTabs}
          activeTabId={activeFileId}
          onSelectTab={onSelectFile}
          onCloseTab={onCloseTab}
        />
        {activeFileId ? (
          <CodeEditor
            value={fileContents[activeFileId] ?? ""}
            onChange={(value) => onChangeContent(activeFileId, value)}
            readOnly={readonlyFileIds.includes(activeFileId)}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-ink-muted">
            Elegí un archivo del árbol para empezar a editar.
          </div>
        )}
      </div>
    </section>
  );
}
