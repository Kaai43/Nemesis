// ---------------------------------------------------------------------------
// Configurações — tela preta "Em construção"
// ---------------------------------------------------------------------------
// Abre ao clicar em "Configurações" no menu de usuário.
// Mostra uma tela preta com a mensagem "Em construção" no centro.
// Será substituída por uma tela real de configurações futuramente.
// ---------------------------------------------------------------------------

interface ConfiguracoesProps {
  /** Controla a visibilidade da tela. */
  isOpen: boolean;
  /** Callback chamado ao fechar (clicar em qualquer lugar). */
  onClose: () => void;
}

/**
 * Tela de Configurações — placeholder "Em construção".
 * Overlay preto total com texto centralizado.
 */
export function Configuracoes({ isOpen, onClose }: ConfiguracoesProps) {
  // Não renderiza nada se fechado
  if (!isOpen) return null;

  return (
    // Overlay preto — clicar em qualquer lugar fecha
    <div className="configuracoes-overlay" onClick={onClose}>
      {/* Texto centralizado "Em construção" */}
      <div className="configuracoes-em-construcao">
        <span className="configuracoes-emoji">🚧</span>
        <h2>Em construção</h2>
        <p>Esta funcionalidade estará disponível em breve.</p>
      </div>
    </div>
  );
}
