// ---------------------------------------------------------------------------
// Welcome — tela de boas-vindas (primeira execução)
// ---------------------------------------------------------------------------
// Exibida apenas na primeira vez que o app é aberto.
// Pede o nome do usuário e salva no backend (SQLite) + localStorage.
// Após completar, App.tsx muda para a tela principal.
// ---------------------------------------------------------------------------

import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface WelcomeProps {
  /** Callback chamado quando o usuário envia o nome com sucesso. */
  onComplete: (userName: string) => void;
}

/**
 * Componente Welcome — tela de primeiro acesso.
 * Formulário com campo de nome que salva no backend via IPC.
 */
export function Welcome({ onComplete }: WelcomeProps) {
  // Nome digitado pelo usuário
  const [userName, setUserName] = useState('');
  // Estado de carregamento durante o salvamento
  const [loading, setLoading] = useState<boolean>(false);
  // Mensagem de erro (se houver)
  const [error, setError] = useState<string | null>(null);

  /**
   * Envia o formulário.
   * Valida o nome, salva no backend (SQLite) e chama onComplete.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validação: nome não pode ser vazio
    if (!userName.trim()) {
      setError('Por favor, digite seu nome.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Salva o nome no banco SQLite via comando IPC do Tauri
      await invoke('save_user_name', { userName: userName.trim() });
      // Notifica o App que o Welcome foi completado
      onComplete(userName.trim());
    } catch (err) {
      setError('Não foi possível salvar seu nome. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="welcome">
      <div className="welcome-card">
        {/* Ícone de boas-vindas */}
        <div className="welcome-icon">👋</div>
        <h1>Bem-vindo, como podemos te chamar?</h1>
        <p>
          Vamos salvar seu nome localmente para personalizar sua experiência
          no Nemesis.
        </p>

        {/* Mensagem de erro (se houver) */}
        {error && (
          <div className="welcome-error">{error}</div>
        )}

        {/* Formulário de nome */}
        <form onSubmit={handleSubmit} className="welcome-form">
          <label htmlFor="userName">Seu nome</label>
          <input
            id="userName"
            type="text"
            autoFocus
            maxLength={50}
            placeholder="Digite seu nome aqui..."
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !userName.trim()}>
            {loading ? 'Salvando...' : 'Começar'}
          </button>
        </form>

        {/* Rodapé: aviso de privacidade */}
        <div className="welcome-footer">
          Suas informações ficam salvas apenas neste computador.
        </div>
      </div>
    </div>
  );
}
