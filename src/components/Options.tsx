interface OptionsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Options({ isOpen, onClose }: OptionsProps) {
  if (!isOpen) return null;

  return (
    <div className="menu-options-overlay" onClick={onClose}>
      <div className="menu-options-card" onClick={(e) => e.stopPropagation()}>
        <div className="menu-options-header">
          <h3>Opções</h3>
          <div className="close-btn" onClick={onClose}>✕</div>
        </div>

        <div className="menu-options-section">
          <div className="menu-item disabled">
            <span className="menu-icon">🔔</span>
            <span className="menu-label">Notificações</span>
            <span className="menu-badge">Em breve</span>
          </div>
          <div className="menu-divider" />
          <div className="menu-item disabled">
            <span className="menu-icon">🎨</span>
            <span className="menu-label">Tema</span>
            <span className="menu-badge">Em breve</span>
          </div>
          <div className="menu-divider" />
          <div className="menu-item disabled">
            <span className="menu-icon">🔊</span>
            <span className="menu-label">Som</span>
            <span className="menu-badge">Em breve</span>
          </div>
          <div className="menu-divider" />
          <div className="menu-item disabled">
            <span className="menu-icon">🌐</span>
            <span className="menu-label">Idioma</span>
            <span className="menu-badge">Em breve</span>
          </div>
        </div>
      </div>
    </div>
  );
}
