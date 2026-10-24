// ---------------------------------------------------------------------------
// CriarNovo Perfil — esqueleto de criação de perfil (NÃO integrado)
// ---------------------------------------------------------------------------
// Componente de tela para criar um novo perfil do zero.
// Ainda NÃO está conectado ao banco de dados ou estado do jogo.
// Será integrado em uma próxima versão.
// ---------------------------------------------------------------------------

import { useState } from 'react';

interface CriarNovoPerfilProps {
  /** Controla a visibilidade do overlay. */
  isOpen: boolean;
  /** Callback chamado ao fechar. */
  onClose: () => void;
}

/**
 * Componente de criação de novo perfil (esqueleto).
 * Formulário com nome e avatar — ainda não persiste dados.
 */
export function CriarNovoPerfil({ isOpen, onClose }: CriarNovoPerfilProps) {
  // Não renderiza se fechado
  if (!isOpen) return null;

  // Nome do novo perfil
  const [nomePerfil, setNomePerfil] = useState('');
  // Avatar (letra ou emoji) do novo perfil
  const [avatarPerfil, setAvatarPerfil] = useState('');

  /**
   * Envia o formulário de criação de perfil.
   * ESQUELETO: ainda não integra com o banco — apenas mostra alerta.
   */
  const handleCriar = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrar com database.rs para salvar o perfil no SQLite
    alert(`Perfil "${nomePerfil}" seria criado aqui (função em desenvolvimento).`);
    onClose();
  };

  return (
    // Overlay escuro — clicar fora fecha
    <div className="criar-novo-perfil-overlay" onClick={onClose}>
      {/* Card de conteúdo — clique dentro não fecha */}
      <div className="criar-novo-perfil-card" onClick={(e) => e.stopPropagation()}>
        {/* Cabeçalho com título e botão de fechar */}
        <div className="criar-novo-perfil-header">
          <h2>Criar Novo Perfil</h2>
          <div className="close-btn" onClick={onClose}>✕</div>
        </div>

        <div className="criar-novo-perfil-content">
          {/* Descrição da funcionalidade */}
          <p className="criar-novo-perfil-desc">
            Preencha os dados abaixo para criar um novo perfil do zero.
            Esta funcionalidade será integrada nas próximas versões.
          </p>

          {/* Formulário de criação */}
          <form onSubmit={handleCriar} className="criar-novo-perfil-form">
            {/* Campo: Nome do perfil */}
            <label className="criar-novo-perfil-label">Nome do perfil</label>
            <input
              type="text"
              className="criar-novo-perfil-input"
              placeholder="Digite o nome do perfil"
              value={nomePerfil}
              onChange={(e) => setNomePerfil(e.target.value)}
              required
            />

            {/* Campo: Avatar (opcional) */}
            <label className="criar-novo-perfil-label">Avatar (opcional)</label>
            <input
              type="text"
              className="criar-novo-perfil-input"
              placeholder="Letra ou emoji para o avatar"
              value={avatarPerfil}
              onChange={(e) => setAvatarPerfil(e.target.value)}
              maxLength={2}
            />

            {/* Botão de submit — desabilitado se nome vazio */}
            <button type="submit" className="criar-novo-perfil-btn" disabled={!nomePerfil.trim()}>
              Criar Perfil
            </button>
          </form>

          {/* Nota: esqueleto, não integrado */}
          <p className="criar-novo-perfil-note">
            Esta tela é um esqueleto. A criação real de perfil será conectada ao banco
            de dados e ao estado do jogo em breve.
          </p>
        </div>
      </div>
    </div>
  );
}
