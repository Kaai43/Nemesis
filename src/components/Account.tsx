import { useState } from 'react';

interface AccountProps {
  userName: string;
  userRole: string;
  avatar: string;
}

export function Account({ userName, userRole, avatar }: AccountProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="account" onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>
      <div className="avatar">{avatar}</div>
      <div className="info">
        <div className="name">{userName}</div>
        <div className="role">{userRole}</div>
      </div>
      <div className="chevron">▾</div>

      {open && (
        <div className="account-dropdown">
          <div className="dropdown-item">Minha conta</div>
          <div className="dropdown-item">Configurações</div>
          <div className="dropdown-divider" />
          <div className="dropdown-item danger">Sair</div>
        </div>
      )}
    </div>
  );
}
