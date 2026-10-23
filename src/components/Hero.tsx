export function Hero() {
  return (
    <div className="hero">
      <div className="badge">Versão 0.1.0 · MVP</div>
      <img
        src="/personagem.png"
        alt="Personagem"
        className="hero-character"
      />
      <div className="hero-text">
        <h1>Bem-vindo ao Nemesis</h1>
        <p>
          Seu controlador extremo de estudos. Defina metas, acompanhe seu
          progresso e mantenha o foco.
        </p>
      </div>
    </div>
  );
}
