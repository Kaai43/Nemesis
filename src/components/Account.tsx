import { useEffect, useRef, useState } from 'react';
import { exit } from '@tauri-apps/api/app';

interface AccountProps {
  userName: string;
  userRole: string;
  avatar: string;
  onConfiguracoes: () => void;
}

export function Account({ userName, userRole, avatar, onConfiguracoes }: AccountProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleSair = async () => {
    try {
      await exit(0);
    } catch {
      // fallback: se o exit falhar, recarrega (volta ao welcome)
      window.location.reload();
    }
  };

  return (
    <div className="account-wrapper" ref={wrapperRef}>
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

      {/* MENU DE USUÁRIO — leque de opções ao clicar no indicador */}
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
            <div className="menu-item" onClick={() => setOpen(false)}>
              <span className="menu-icon">👤</span>
              <span className="menu-label">Usuário</span>
            </div>
            <div className="menu-divider" />
            <div className="menu-item" onClick={() => { setOpen(false); onConfiguracoes(); }}>
              <span className="menu-icon">⚙️</span>
              <span className="menu-label">Configurações</span>
            </div>
            <div className="menu-divider" />
            <div className="menu-item danger" onClick={handleSair}>
              <span className="menu-icon">🚪</span>
              <span className="menu-label">Sair</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
