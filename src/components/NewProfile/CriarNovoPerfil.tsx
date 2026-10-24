import { useState } from 'react';

interface CriarNovoPerfilProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CriarNovoPerfil({ isOpen, onClose }: CriarNovoPerfilProps) {
  if (!isOpen) return null;

  const [nomePerfil, setNomePerfil] = useState('');
  const [avatarPerfil, setAvatarPerfil] = useState('');

  const handleCriar = (e: React.FormEvent) => {
    e.preventDefault();
    // Função esqueleto — ainda não integrada ao banco/estado
    alert(`Perfil "${nomePerfil}" seria criado aqui (função em desenvolvimento).`);
    onClose();
  };

  return (
    <div className="criar-novo-perfil-overlay" onClick={onClose}>
      <div className="criar-novo-perfil-card" onClick={(e) => e.stopPropagation()}>
        <div className="criar-novo-perfil-header">
          <h2>Criar Novo Perfil</h2>
          <div className="close-btn" onClick={onClose}>✕</div>
        </div>

        <div className="criar-novo-perfil-content">
          <p className="criar-novo-perfil-desc">
            Preencha os dados abaixo para criar um novo perfil do zero.
            Esta funcionalidade será integrada nas próximas versões.
          </p>

          <form onSubmit={handleCriar} className="criar-novo-perfil-form">
            <label className="criar-novo-perfil-label">Nome do perfil</label>
            <input
              type="text"
              className="criar-novo-perfil-input"
              placeholder="Digite o nome do perfil"
              value={nomePerfil}
              onChange={(e) => setNomePerfil(e.target.value)}
              required
            />

            <label className="criar-novo-perfil-label">Avatar (opcional)</label>
            <input
              type="text"
              className="criar-novo-perfil-input"
              placeholder="Letra ou emoji para o avatar"
              value={avatarPerfil}
              onChange={(e) => setAvatarPerfil(e.target.value)}
              maxLength={2}
            />

            <button type="submit" className="criar-novo-perfil-btn" disabled={!nomePerfil.trim()}>
              Criar Perfil
            </button>
          </form>

          <p className="criar-novo-perfil-note">
            Esta tela é um esqueleto. A criação real de perfil será conectada ao banco
            de dados e ao estado do jogo em breve.
          </p>
        </div>
      </div>
    </div>
  );
}
