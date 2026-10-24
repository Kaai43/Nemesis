// ---------------------------------------------------------------------------
// Hero — seção de boas-vindas com imagem do personagem
// ---------------------------------------------------------------------------
// Exibe a imagem do personagem (personagem.png), título de boas-vindas
// e descrição do aplicativo. Fica ao lado do RpgPanel no layout principal.
// ---------------------------------------------------------------------------

/**
 * Componente Hero — apresentação visual do app.
 * Mostra badge de versão, personagem animado e texto de boas-vindas.
 */
export function Hero() {
  return (
    <div className="hero">
      {/* Badge de versão do build */}
      <div className="badge">Versão 0.1.0 · MVP</div>

      {/* Imagem do personagem com animação flutuante */}
      <img
        src="/personagem.png"
        alt="Personagem"
        className="hero-character"
      />

      {/* Texto de boas-vindas */}
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
