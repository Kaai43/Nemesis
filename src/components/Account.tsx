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
      {/* Botão da conta — clicar abre o menu com as 3 opções */}
      <div
        className={`account ${open ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        <div className="avatar">{avatar}</div>
        <div className="info">
          <div className="name">{userName}</div>
          <div className="role">{userRole}</div>
        </div>
        <div className="chevron">▾</div>
      </div>

      {/* =====================================================================
         MENU DE CONTA — aparece apenas quando clica no nome/avatar
         Contém as 3 opções: Configuração, Perfil, Sair
         ===================================================================== */}
      {open && (
        <div className="menu-account">
          <div className="menu-section">
            <div className="menu-item" onClick={handleSaveName}>
              <span className="menu-icon">👤</span>
              <span className="menu-label">Perfil</span>
            </div>
            <div className="menu-divider" />
            <div className="menu-item" onClick={() => alert('Configurações da conta')}>
              <span className="menu-icon">🔧</span>
              <span className="menu-label">Configuração</span>
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
