import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { Navbar } from "./components/navigation/Navbar";
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

  return (
    <main className="mx-auto max-w-[1600px] px-4 pt-8 pb-16 sm:px-6">
      <ChallengePage caseId={caseId} onCaseResolved={markResolved} />
    </main>
  );
}
