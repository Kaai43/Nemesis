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
  const [menu, setMenu] = useState<'account' | 'options' | null>(null);

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
      {/* Botão da conta (abre menu conta) */}
      <div
        className={`account ${open && menu === 'account' ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          if (menu === 'account') {
            setOpen(false);
            setMenu(null);
          } else {
            setOpen(true);
            setMenu('account');
          }
        }}
      >
        <div className="avatar">{avatar}</div>
        <div className="info">
          <div className="name">{userName}</div>
          <div className="role">{userRole}</div>
        </div>
        <div className="chevron">▾</div>
      </div>

      {/* Botão de opções (abre menu opções - apenas aparência) */}
      <div
        className={`options-btn ${open && menu === 'options' ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          if (menu === 'options') {
            setOpen(false);
            setMenu(null);
          } else {
            setOpen(true);
            setMenu('options');
          }
        }}
        title="Opções"
      >
        <div className="options-icon">⚙</div>
      </div>

      {/* =====================================================================
         MENU DE CONTA — aparência e botões funcionais
         ===================================================================== */}
      {open && menu === 'account' && (
        <div className="menu-account">
          <div className="menu-section">
            <div className="menu-item" onClick={handleSaveName}>
              <span className="menu-icon">👤</span>
              <span className="menu-label">Minha conta</span>
            </div>
            <div className="menu-divider" />
            <div className="menu-item" onClick={() => alert('Configurações da conta')}>
              <span className="menu-icon">🔧</span>
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

      {/* =====================================================================
         MENU DE OPÇÕES — apenas aparência (não funcional nesta versão)
         ===================================================================== */}
      {open && menu === 'options' && (
        <div className="menu-options">
          <div className="menu-section">
            <div className="menu-item disabled">
              <span className="menu-icon">🔔</span>
              <span className="menu-label">Notificações</span>
            </div>
            <div className="menu-divider" />
            <div className="menu-item disabled">
              <span className="menu-icon">🎨</span>
              <span className="menu-label">Tema</span>
            </div>
            <div className="menu-divider" />
            <div className="menu-item disabled">
              <span className="menu-icon">🔊</span>
              <span className="menu-label">Som</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
