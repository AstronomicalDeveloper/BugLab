import { Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/navigation/Navbar";
import { ChallengePage } from "./pages/ChallengePage";
import { HomePage } from "./pages/HomePage";
import { ProgressPage } from "./pages/ProgressPage";

/**
 * Rutas de la Propuesta §19. "/" muestra directamente la selección de
 * desafíos, así que "/challenges" redirige ahí.
 *
 * El resultado del desafío (§12) todavía vive dentro de ChallengePage; se
 * separa en "/challenges/:id/result" cuando exista el estado de resolución.
 */
export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/challenges" element={<Navigate to="/" replace />} />
        <Route path="/challenges/:challengeId" element={<ChallengePage />} />
        <Route path="/challenges/:challengeId/result" element={<ChallengePage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
