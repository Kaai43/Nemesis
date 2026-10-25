// ---------------------------------------------------------------------------
// Perfil — esqueleto da área de perfil (preparação para 0.2.0)
// ---------------------------------------------------------------------------
// IMPORTANTE: este componente NÃO está integrado em nenhuma tela.
// Ele não é importado pelo App, portanto nada dele aparece no aplicativo.
//
// Na 0.2.0 ele será aberto pela opção "Usuário" do menu de conta e permitirá:
//   * editar nome e avatar;
//   * alternar entre perfis;
//   * exibir estatísticas de estudo;
//   * integrar com o banco SQLite (database.rs).
// ---------------------------------------------------------------------------

interface PerfilProps {
  /** Controla a visibilidade do painel de perfil. */
  isOpen: boolean;
  /** Callback chamado ao fechar o painel. */
  onClose: () => void;
}

/**
 * Esqueleto da área de Perfil.
 * Enquanto não integrado, permanece invisível (retorna null se fechado).
 */
export function Perfil({ isOpen, onClose }: PerfilProps) {
  // Mantém o esqueleto totalmente oculto nesta versão
  if (!isOpen) return null;

  return (
    <div className="perfil-overlay" onClick={onClose}>
      <div className="perfil-card" onClick={(e) => e.stopPropagation()}>
        {/* Cabeçalho do painel de perfil */}
        <div className="perfil-header">
          <h2>Perfil</h2>
          <div className="close-btn" onClick={onClose}>✕</div>
        </div>

        {/* =================================================================
           ESQUELETO (0.2.0)
           Aqui serão montados: avatar, nome editável, estatísticas,
           histórico de estudo e seleção de perfis.
           ================================================================= */}
        <div className="perfil-content">
          <p className="perfil-placeholder">Área de perfil em preparação.</p>
        </div>
      </div>
    </div>
  );
}
