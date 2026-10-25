// ---------------------------------------------------------------------------
// Configurações — esqueleto (preparação para a versão 0.2.0)
// ---------------------------------------------------------------------------
// Comportamento atual:
//   * Ocupa a tela inteira com fundo preto.
//   * Exibe APENAS o botão "X" no canto superior direito.
//   * O "X" é a ÚNICA forma de sair — clicar no fundo NÃO fecha.
//   * Nenhum conteúdo do esqueleto (tema, notificações, idioma) é exibido.
//
// O conteúdo real será montado aqui na 0.2.0.
// ---------------------------------------------------------------------------

interface ConfiguracoesProps {
  /** Controla a visibilidade da tela. */
  isOpen: boolean;
  /** Callback chamado ao clicar no botão "X" (única saída). */
  onClose: () => void;
}

/**
 * Tela de Configurações (esqueleto).
 * Fundo preto + botão X no canto superior direito.
 * O clique no fundo é intencionalmente ignorado para que a única saída
 * seja o botão X.
 */
export function Configuracoes({ isOpen, onClose }: ConfiguracoesProps) {
  // Não renderiza nada se fechado
  if (!isOpen) return null;

  return (
    <div
      className="configuracoes-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Configurações"
    >
      {/* Botão X — única forma de sair desta tela */}
      <button
        type="button"
        className="configuracoes-close"
        onClick={onClose}
        aria-label="Fechar configurações"
      >
        ✕
      </button>

      {/* =================================================================
         ESQUELETO OCULTO (0.2.0)
         Aqui serão montados: Tema, Notificações, Idioma e demais ajustes.
         Nada é renderizado nesta versão, conforme solicitado.
         ================================================================= */}
    </div>
  );
}
