import { useState } from 'react';

interface ConfiguracoesProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Esqueleto da tela de Configurações.
 * Ainda NÃO implementado — apenas estrutura visual.
 */
export function Configuracoes({ isOpen, onClose }: ConfiguracoesProps) {
  const [tema, setTema] = useState('preto');

  if (!isOpen) return null;

  return (
    <div className="configuracoes-overlay" onClick={onClose}>
      <div className="configuracoes-card" onClick={(e) => e.stopPropagation()}>
        <div className="configuracoes-header">
          <h2>Configurações</h2>
          <div className="close-btn" onClick={onClose}>✕</div>
        </div>

        <div className="configuracoes-content">
          <p className="configuracoes-desc">
            Ajustes do aplicativo. Esta seção está em desenvolvimento e será
            integrada em uma próxima versão.
          </p>

          <div className="configuracoes-group">
            <label className="configuracoes-label">Tema</label>
            <select
              className="configuracoes-select"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              disabled
            >
              <option value="preto">Preto</option>
              <option value="claro">Claro (em breve)</option>
            </select>
          </div>

          <div className="configuracoes-group">
            <label className="configuracoes-label">Notificações</label>
            <div className="configuracoes-placeholder">
              Em breve — alertas de sessão de estudo
            </div>
          </div>

          <div className="configuracoes-group">
            <label className="configuracoes-label">Idioma</label>
            <div className="configuracoes-placeholder">
              Em breve — Português (Brasil)
            </div>
          </div>

          <p className="configuracoes-note">
            Esqueleto — funcionalidades serão conectadas ao backend futuramente.
          </p>
        </div>
      </div>
    </div>
  );
}
