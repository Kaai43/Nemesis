interface SobreProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sobre({ isOpen, onClose }: SobreProps) {
  if (!isOpen) return null;

  return (
    <div className="sobre-overlay" onClick={onClose}>
      <div className="sobre-card" onClick={(e) => e.stopPropagation()}>
        <div className="sobre-header">
          <h2>Sobre o Nemesis</h2>
          <div className="close-btn" onClick={onClose}>✕</div>
        </div>

        <div className="sobre-content">
          {/* Ícone principal acima do texto */}
          <img
            src="/icones/sobre/iconesobre.jpg"
            alt="Ícone Sobre"
            className="sobre-icon-img"
          />
          <h3>Controlador Extremo de Estudos</h3>
          <p>
            O Nemesis é um aplicativo desktop nativo desenvolvido em Rust + Tauri v2 +
            React, projetado especificamente para ajudar pessoas com TDAH a manter o foco
            nos estudos e organizar sua rotina de produtividade.
          </p>

          <div className="sobre-divider" />

          <div className="sobre-feature">
            <img
              src="/icones/sobre/escuro.jpg"
              alt="Tema escuro"
              className="feature-img"
            />
            <span>Tema preto como padrão para reduzir o cansaço visual</span>
          </div>
          <div className="sobre-feature">
            <img
              src="/icones/sobre/estatistica.jpg"
              alt="Progresso RPG"
              className="feature-img"
            />
            <span>Painel de progresso RPG (nível, XP, ouro e vida)</span>
          </div>
          <div className="sobre-feature">
            <img
              src="/icones/sobre/banco.jpg"
              alt="Persistência"
              className="feature-img"
            />
            <span>Persistência local com banco de dados SQLite</span>
          </div>
          <div className="sobre-feature">
            <img
              src="/icones/sobre/seguranca.jpg"
              alt="Segurança"
              className="feature-img"
            />
            <span>Todas as informações ficam apenas no seu computador</span>
          </div>

          <div className="sobre-divider" />

          <p className="sobre-version">
            Versão 0.1.0 · MVP · Build de correções
          </p>
        </div>
      </div>
    </div>
  );
}
