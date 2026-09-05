interface ChallengeHeaderProps {
  id: string;
  titulo: string;
  nivel: string;
  aprendizajePrincipal: string;
  isSolved: boolean;
}

export default function ChallengeHeader({
  id,
  titulo,
  nivel,
  aprendizajePrincipal,
  isSolved,
}: ChallengeHeaderProps) {
  return (
    <header className="challenge-header challenge-surface challenge-surface--level-2">
      <div className="challenge-header__meta">
        <span className="challenge-chip challenge-chip--id">{id}</span>
        {nivel && (
          <span className="challenge-chip challenge-chip--level">{nivel}</span>
        )}
        {isSolved && (
          <span className="challenge-chip challenge-chip--solved">Resuelto</span>
        )}
      </div>

      <h1 className="challenge-header__title">{titulo}</h1>

      {aprendizajePrincipal && (
        <p className="challenge-header__learning">
          <strong>Qué practicas aquí:</strong> {aprendizajePrincipal}
        </p>
      )}
    </header>
  );
}
