// ---------------------------------------------------------------------------
// Sobre — overlay informativo sobre o aplicativo Nemesis
// ---------------------------------------------------------------------------
// Abre ao clicar no ícone/nome "Nemesis" na barra superior.
// Mostra descrição do app, funcionalidades e versão.
// As imagens dos ícones ficam em public/ e são servidas pelo Vite.
// ---------------------------------------------------------------------------

interface SobreProps {
  /** Controla a visibilidade do overlay. */
  isOpen: boolean;
  /** Callback chamado ao fechar (clicar fora ou no botão ✕). */
  onClose: () => void;
}

/**
 * Componente de overlay "Sobre o Nemesis".
 * Renderiza uma card centralizada com informações do aplicativo.
 */
export function Sobre({ isOpen, onClose }: SobreProps) {
  // Não renderiza nada se o overlay estiver fechado
  if (!isOpen) return null;

  return (
    // Overlay escuro — clicar fora fecha
    <div className="sobre-overlay" onClick={onClose}>
      {/* Card de conteúdo — clique dentro não fecha */}
      <div className="sobre-card" onClick={(e) => e.stopPropagation()}>
        {/* Cabeçalho com título e botão de fechar */}
        <div className="sobre-header">
          <h2>Sobre o Nemesis</h2>
          <div className="close-btn" onClick={onClose}>✕</div>
        </div>

        <div className="sobre-content">
          {/* Ícone principal — iconesobre.jpg acima do título */}
          <img
            src="/iconesobre.jpg"
            alt="Ícone Sobre"
            className="sobre-icon-img"
          />
          <h3>Controlador Extremo de Estudos</h3>
          <p>
            O Nemesis é um aplicativo desktop nativo desenvolvido em Rust + Tauri v2 +
            React, projetado especificamente para ajudar pessoas com TDAH a manter o foco
            nos estudos e organizar sua rotina de produtividade.
          </p>

          {/* Divisor visual entre descrição e funcionalidades */}
          <div className="sobre-divider" />

          {/* Funcionalidade 1 — Tema escuro */}
          <div className="sobre-feature">
            <img src="/escuro.jpg" alt="Tema escuro" className="feature-img" />
            <span>Tema preto como padrão para reduzir o cansaço visual</span>
          </div>

          {/* Funcionalidade 2 — Painel RPG */}
          <div className="sobre-feature">
            <img src="/estatistica.jpg" alt="Progresso RPG" className="feature-img" />
            <span>Painel de progresso RPG (nível, XP, ouro e vida)</span>
          </div>

          {/* Funcionalidade 3 — Persistência local */}
          <div className="sobre-feature">
            <img src="/banco.jpg" alt="Persistência" className="feature-img" />
            <span>Persistência local com banco de dados SQLite</span>
          </div>

          {/* Funcionalidade 4 — Privacidade */}
          <div className="sobre-feature">
            <img src="/seguranca.jpg" alt="Segurança" className="feature-img" />
            <span>Todas as informações ficam apenas no seu computador</span>
          </div>

          {/* Divisor antes da versão */}
          <div className="sobre-divider" />

          {/* Versão do build atual */}
          <p className="sobre-version">
            Versão 0.1.0 · MVP · Build de correções
          </p>
        </div>
      </div>
    </div>
  );
}
