import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface WelcomeProps {
  onComplete: (userName: string) => void;
}

export function Welcome({ onComplete }: WelcomeProps) {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setError('Por favor, digite seu nome.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await invoke('save_user_name', { userName: userName.trim() });
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
        <div className="welcome-icon">👋</div>
        <h1>Bem-vindo, como podemos te chamar?</h1>
        <p>
          Vamos salvar seu nome localmente para personalizar sua experiência
          no Nemesis.
        </p>

        {error && (
          <div className="welcome-error">{error}</div>
        )}

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

        <div className="welcome-footer">
          Suas informações ficam salvas apenas neste computador.
        </div>
      </div>
    </div>
  );
}
