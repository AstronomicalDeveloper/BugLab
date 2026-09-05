import { useCallback, useState } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { Navbar } from "./components/navigation/Navbar";
import { SolvedDialog } from "./components/challenge/SolvedDialog";
import ChallengePage from "./pages/ChallengePage";
import { HomePage } from "./pages/HomePage";
import { ProgressPage } from "./pages/ProgressPage";
import { markResolved } from "./lib/progress";

/**
 * Rutas de la Propuesta §19. "/" muestra directamente la selección de
 * desafíos, así que "/challenges" redirige ahí.
 */
export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/challenges" element={<Navigate to="/" replace />} />
        <Route path="/challenges/:caseId" element={<ChallengeRoute />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

/**
 * Adaptador entre el router del shell y `ChallengePage`, que a propósito no
 * depende de react-router (ver `src/pages/INTEGRACION.md`).
 *
 * `ChallengePage` no dibuja fondo ni navegación y ocupa el ancho de su
 * contenedor: el padding exterior y el ancho máximo los decide el shell.
 */
function ChallengeRoute() {
  const { caseId } = useParams();

  if (!caseId) return <Navigate to="/" replace />;

  // La clave hace que al cambiar de caso se monte una vista nueva: el diálogo
  // del caso anterior no puede quedar en pantalla y no hace falta resetearlo.
  return <ChallengeView key={caseId} caseId={caseId} />;
}

function ChallengeView({ caseId }: { caseId: string }) {
  const [solvedCase, setSolvedCase] = useState<string | null>(null);

  const handleResolved = useCallback((resolvedId: string) => {
    markResolved(resolvedId);
    setSolvedCase(resolvedId);
  }, []);

  return (
    <main className="mx-auto max-w-[1600px] px-4 pt-8 pb-16 sm:px-6">
      <ChallengePage caseId={caseId} onCaseResolved={handleResolved} />

      {solvedCase && (
        <SolvedDialog caseId={solvedCase} onClose={() => setSolvedCase(null)} />
      )}
    </main>
  );
}
