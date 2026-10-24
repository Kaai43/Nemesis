import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface AccountProps {
  userName: string;
  userRole: string;
  avatar: string;
  onLogout: () => void;
}

export function Account({ userName, userRole, avatar, onLogout }: AccountProps) {
  const [open, setOpen] = useState(false);

  const handleSaveName = async () => {
    try {
      await invoke('save_user_name', { user_name: userName });
      alert('Nome salvo com sucesso!');
    } catch (err) {
      alert('Erro ao salvar nome.');
      console.error(err);
    }
  };

  return (
    <div className="account-wrapper">
      {/* Indicador para baixo — abre o menu de usuário */}
      <div
        className={`account-indicator ${open ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        <div className="indicator-arrow">▾</div>
      </div>

      {/* =====================================================================
         MENU DE USUÁRIO — leque de opções ao clicar no indicador
         Acima das opções: ícone do usuário + nome
         ===================================================================== */}
      {open && (
        <div className="menu-usuario">
          <div className="menu-usuario-header">
            <div className="user-avatar">{avatar}</div>
            <div className="user-info">
              <div className="user-name">{userName}</div>
              <div className="user-role">{userRole}</div>
            </div>
          </div>

          <div className="menu-usuario-secao">
            <div className="menu-item" onClick={handleSaveName}>
              <span className="menu-icon">👤</span>
              <span className="menu-label">Usuário</span>
            </div>
            <div className="menu-divider" />
            <div className="menu-item" onClick={() => alert('Configurações da conta')}>
              <span className="menu-icon">⚙️</span>
              <span className="menu-label">Configurações</span>
            </div>
            <div className="menu-divider" />
            <div className="menu-item danger" onClick={onLogout}>
              <span className="menu-icon">🚪</span>
              <span className="menu-label">Sair</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
