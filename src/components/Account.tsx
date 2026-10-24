// ---------------------------------------------------------------------------
// Account — menu de usuário no canto superior direito
// ---------------------------------------------------------------------------
// Exibe um indicador (▾) que ao clicar abre um leque de opções:
//   Usuário, Configurações, Sair.
// Acima das opções mostra o avatar e nome do usuário.
// "Sair" fecha o aplicativo de verdade via exit(0) do Tauri.
// ---------------------------------------------------------------------------

import { useEffect, useRef, useState } from 'react';
import { exit } from '@tauri-apps/api/app';

interface AccountProps {
  /** Nome do usuário exibido no cabeçalho do menu. */
  userName: string;
  /** Papel/cargo do usuário (ex: "Jogador"). */
  userRole: string;
  /** Letra inicial do avatar. */
  avatar: string;
  /** Callback chamado ao clicar em "Configurações". */
  onConfiguracoes: () => void;
}

/**
 * Componente de menu de usuário.
 * Renderiza um indicador▾ que abre/fecha o dropdown com 3 opções.
 */
export function Account({ userName, userRole, avatar, onConfiguracoes }: AccountProps) {
  // Estado de abertura do menu dropdown
  const [open, setOpen] = useState(false);
  // Referência ao wrapper para detectar clique fora
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Efeito: fecha o menu ao clicar fora do wrapper (click-outside)
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    // Limpeza: remove o listener ao desmontar ou mudar estado
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  /**
   * Fecha o aplicativo de verdade.
   * Usa exit(0) do Tauri API (requer permissão core:app:allow-exit).
   * Fallback: recarrega a página se o exit falhar.
   */
  const handleSair = async () => {
    try {
      await exit(0);
    } catch {
      window.location.reload();
    }
  };

  return (
    <div className="account-wrapper" ref={wrapperRef}>
      {/* Indicador ▾ — clique abre/fecha o menu */}
      <div
        className={`account-indicator ${open ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        <div className="indicator-arrow">▾</div>
      </div>

      {/* Dropdown do menu — só renderiza quando open === true */}
      {open && (
        <div className="menu-usuario">
          {/* Cabeçalho: avatar + nome do usuário */}
          <div className="menu-usuario-header">
            <div className="user-avatar">{avatar}</div>
            <div className="user-info">
              <div className="user-name">{userName}</div>
              <div className="user-role">{userRole}</div>
            </div>
          </div>

          {/* Seção com as 3 opções do menu */}
          <div className="menu-usuario-secao">
            {/* Opção: Usuário — fecha o menu (perfil em breve) */}
            <div className="menu-item" onClick={() => setOpen(false)}>
              <span className="menu-icon">(o)</span>
              <span className="menu-label">Usuário</span>
            </div>
            <div className="menu-divider" />

            {/* Opção: Configurações — abre tela "Em construção" */}
            <div
              className="menu-item"
              onClick={() => {
                setOpen(false);
                onConfiguracoes();
              }}
            >
              <span className="menu-icon">(*)</span>
              <span className="menu-label">Configurações</span>
            </div>
            <div className="menu-divider" />

            {/* Opção: Sair — fecha o aplicativo */}
            <div className="menu-item danger" onClick={handleSair}>
              <span className="menu-icon">[X]</span>
              <span className="menu-label">Sair</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
