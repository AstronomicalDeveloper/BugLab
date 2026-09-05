/**
 * Harness de desarrollo — NO forma parte de la entrega.
 *
 * Existe solo para poder abrir `ChallengePage` mientras el shell general de la
 * app se construye en paralelo. Cuando el shell esté listo, este archivo se
 * reemplaza por el layout real y `ChallengePage` se registra en su router:
 *
 *   <Route path="/challenge/:caseId" element={<ChallengePageRoute />} />
 *
 * El fondo de aquí abajo es un stand-in del que pinta el shell.
 */
import ChallengePage from "./pages/ChallengePage";
import { DEFAULT_CASE_ID } from "./mocks";

/** Lee el caso de `/challenge/:caseId` o de `?case=`, sin depender de un router. */
function readCaseIdFromUrl(): string {
  const fromPath = window.location.pathname.match(/\/challenge\/([^/?#]+)/);
  if (fromPath) return decodeURIComponent(fromPath[1]);

  return new URLSearchParams(window.location.search).get("case") ?? DEFAULT_CASE_ID;
}

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "32px",
        background: "#f6f8fb",
      }}
    >
      <ChallengePage
        caseId={readCaseIdFromUrl()}
        onCaseResolved={(caseId) => {
          console.info(`[harness] caso resuelto: ${caseId}`);
        }}
      />
    </div>
  );
}
