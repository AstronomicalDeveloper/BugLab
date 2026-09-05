/**
 * Experiencia de un caso de debugging.
 *
 * Se monta dentro del shell general de la app. No dibuja el fondo de página ni
 * la navegación global, no crea router propio y no usa `100vh`/`100vw`: ocupa
 * el ancho de su contenedor y el shell decide el layout alrededor.
 *
 * Para registrarla en el router del shell:
 *
 *   import ChallengePage from "./pages/ChallengePage";
 *
 *   <Route
 *     path="/challenge/:caseId"
 *     element={<ChallengePageRoute />}
 *   />
 *
 *   // Adaptador de 3 líneas, propiedad del shell (evita que este paquete
 *   // dependa de react-router):
 *   function ChallengePageRoute() {
 *     const { caseId } = useParams();
 *     return <ChallengePage caseId={caseId!} />;
 *   }
 */
import { useEffect, useRef, useState } from "react";
import ArchitectureView from "../components/ArchitectureView";
import ChallengeHeader from "../components/ChallengeHeader";
import CodeEditor from "../components/CodeEditor";
import ExecuteButton from "../components/ExecuteButton";
import ExplanationModal from "../components/ExplanationModal";
import FileTree from "../components/FileTree";
import HintSystem from "../components/HintSystem";
import ReportViewer from "../components/ReportViewer";
import TestResults from "../components/TestResults";
import { useChallengeLoader } from "../hooks/useChallengeLoader";
import { useEditorState } from "../hooks/useEditorState";
import { useValidation } from "../hooks/useValidation";
import type { NormalizedChallenge } from "../types/challenge";
import "../styles/challenge.css";

export interface ChallengePageProps {
  /** Id del caso a abrir, por ejemplo el `:caseId` de la ruta del shell. */
  caseId: string;
  /** Se invoca una sola vez, cuando todos los tests del caso pasan. */
  onCaseResolved?: (caseId: string) => void;
}

export default function ChallengePage({
  caseId,
  onCaseResolved,
}: ChallengePageProps) {
  const { status, challenge, error } = useChallengeLoader(caseId);

  return (
    <div className="challenge-root">
      {status === "loading" && <LoadingState />}

      {status === "error" && (
        <div className="challenge-state challenge-state--error challenge-surface challenge-surface--level-2">
          <p className="challenge-state__title">
            No se pudo conectar con el servidor de validación.
          </p>
          {error && <p className="challenge-state__detail">{error}</p>}
        </div>
      )}

      {status === "ready" && challenge && (
        <ChallengeWorkspace
          key={challenge.id}
          challenge={challenge}
          caseId={caseId}
          onCaseResolved={onCaseResolved}
        />
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div
      className="challenge-state challenge-surface challenge-surface--level-2"
      aria-busy="true"
      aria-label="Cargando el caso"
    >
      <div className="challenge-skeleton" style={{ width: "40%" }} />
      <div className="challenge-skeleton" style={{ width: "70%" }} />
      <div className="challenge-skeleton" style={{ width: "55%" }} />
    </div>
  );
}

interface ChallengeWorkspaceProps {
  challenge: NormalizedChallenge;
  caseId: string;
  onCaseResolved?: (caseId: string) => void;
}

function ChallengeWorkspace({
  challenge,
  caseId,
  onCaseResolved,
}: ChallengeWorkspaceProps) {
  const editor = useEditorState(challenge.editableFiles);
  const validation = useValidation(caseId);
  const [isExplanationOpen, setExplanationOpen] = useState(false);
  const notified = useRef(false);

  /**
   * Archivo abierto. Arranca en el primero del árbol y no en el editable:
   * descubrir cuál hay que tocar es parte del ejercicio.
   */
  const [activePath, setActivePath] = useState<string | null>(
    challenge.archivos[0]?.ruta ?? null,
  );

  // El shell se entera del progreso por callback, no por un store compartido.
  useEffect(() => {
    if (validation.isSolved && !notified.current) {
      notified.current = true;
      onCaseResolved?.(caseId);
    }
  }, [validation.isSolved, onCaseResolved, caseId]);

  const failedAttempt =
    validation.status === "done" && !validation.isSolved;

  return (
    <>
      <ChallengeHeader
        id={challenge.id}
        titulo={challenge.titulo}
        nivel={challenge.nivel}
        aprendizajePrincipal={challenge.aprendizajePrincipal}
        isSolved={validation.isSolved}
      />

      <div className="challenge-layout">
        {/* Izquierda: dónde mirar y con qué ayuda. */}
        <aside className="challenge-col challenge-col--files">
          <FileTree
            files={challenge.archivos}
            activePath={activePath}
            onSelect={setActivePath}
          />
          <HintSystem pistas={challenge.pistas} />
        </aside>

        {/* Centro: el trabajo. Editor, ejecución y resultados. */}
        <section className="challenge-col challenge-col--work">
          <CodeEditor
            files={challenge.archivos}
            activePath={activePath}
            onSelectPath={setActivePath}
            contents={editor.contents}
            onChange={editor.setContent}
            onReset={editor.resetFile}
            isDirty={editor.isDirty}
          />

          <div className="challenge-actions">
            <ExecuteButton
              onClick={() => void validation.run(editor.submittedFiles)}
              isRunning={validation.status === "running"}
              disabled={challenge.editableFiles.length === 0}
            />
            {failedAttempt && (
              <span className="challenge-actions__hint">
                Intento {validation.attempts}: revisa el reporte o pide una pista.
              </span>
            )}
          </div>

          <TestResults
            status={validation.status}
            result={validation.result}
            error={validation.error}
            isSolved={validation.isSolved}
            explanationAvailable={challenge.explicacionFinal !== null}
            onOpenExplanation={() => setExplanationOpen(true)}
          />
        </section>

        {/* Derecha: el contexto del caso. Qué falla y cómo está armado. */}
        <aside className="challenge-col challenge-col--context">
          <ReportViewer reporte={challenge.reporte} />
          <ArchitectureView arquitectura={challenge.arquitectura} />
        </aside>
      </div>

      {isExplanationOpen && challenge.explicacionFinal && (
        <ExplanationModal
          explicacion={challenge.explicacionFinal}
          onClose={() => setExplanationOpen(false)}
        />
      )}
    </>
  );
}
