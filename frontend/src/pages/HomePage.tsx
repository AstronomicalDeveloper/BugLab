import { ChallengeGrid } from "../components/landing/ChallengeGrid";
import { ClosingCta } from "../components/landing/ClosingCta";
import { ContextBar } from "../components/landing/ContextBar";
import { FeatureCards } from "../components/landing/FeatureCards";
import { Hero } from "../components/landing/Hero";
import { WorkspaceMockup } from "../components/landing/WorkspaceMockup";
import { SectionDivider } from "../components/common/SectionDivider";

/**
 * Pantalla de inicio y selección de desafíos (Propuesta §3 y §19: la ruta "/"
 * muestra directamente el catálogo).
 */
export function HomePage() {
  return (
    <main>
      <Hero />
      <ContextBar />

      <SectionDivider />
      <FeatureCards />

      <SectionDivider />
      <WorkspaceMockup />

      <SectionDivider />
      <ChallengeGrid />

      <ClosingCta />
    </main>
  );
}
