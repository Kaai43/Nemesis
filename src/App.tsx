// ---------------------------------------------------------------------------
// App — componente raiz do aplicativo Nemesis
// ---------------------------------------------------------------------------
// Responsável por:
//   * Carregar estado inicial (nome do usuário, info do app, estado RPG)
//   * Gerenciar telas: Welcome, tela principal, Sobre, Configurações
//   * Comunicar com o backend Rust via Tauri IPC (invoke)
// ---------------------------------------------------------------------------

import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Account } from './components/Account';
import { Hero } from './components/Hero';
import { RpgPanel } from './components/RpgPanel';
import { Welcome } from './components/Welcome';
import { Sobre } from './components/Sobre';
import { CriarNovoPerfil } from './components/NewProfile/CriarNovoPerfil';
import { Configuracoes } from './components/Settings/Configuracoes';
import './components/Welcome.css';
import './components/NewProfile/CriarNovoPerfil.css';
import './components/Settings/Configuracoes.css';

/** Metadados da aplicação retornados pelo backend. */
interface AppInfo {
  name: string;
  version: string;
}

/** Estado RPG retornado pelo backend (nível, XP, ouro, vida). */
interface GameState {
  level: number;
  xp: number;
  xp_to_next: number;
  gold: number;
  hp: number;
  max_hp: number;
}

/**
 * Componente raiz do app.
 * Controla qual tela é exibida (Welcome vs tela principal) e
 * gerencia os overlays (Sobre, CriarNovoPerfil, Configurações).
 */
export default function App() {
  // Info da aplicação (nome, versão) — carregada do backend
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  // Estado RPG — carregado do backend, exibido no RpgPanel
  const [game, setGame] = useState<GameState>({
    level: 1,
    xp: 0,
    xp_to_next: 100,
    gold: 0,
    hp: 100,
    max_hp: 100,
  });
  // Nome do usuário — salvo no localStorage após o Welcome
  const [userName, setUserName] = useState<string | null>(null);
  // Se o usuário já viu a tela de boas-vindas (true) ou não (false)
  const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean | null>(null);
  // Controle de visibilidade do overlay Sobre
  const [sobreOpen, setSobreOpen] = useState(false);
  // Controle de visibilidade do overlay CriarNovoPerfil (esqueleto)
  const [criarNovoPerfilOpen, setCriarNovoPerfilOpen] = useState(false);
  // Controle de visibilidade da tela Configurações ("Em construção")
  const [configuracoesOpen, setConfiguracoesOpen] = useState(false);

  // Efeito: carrega estado inicial ao montar o componente
  useEffect(() => {
    const init = async () => {
      // 1. Verifica se o usuário já viu o Welcome (localStorage)
      try {
        const seen = localStorage.getItem('nemesis.seenWelcome') === '1';
        setHasSeenWelcome(seen);
        if (seen) {
          const storedName = localStorage.getItem('nemesis.userName');
          setUserName(storedName || null);
        }
      } catch {
        setHasSeenWelcome(false);
      }

      // 2. Busca info da aplicação (nome, versão) do backend Rust
      try {
        const info = await invoke<AppInfo>('get_app_info');
        setAppInfo(info);
      } catch {
        // Tauri não está em execução (modo dev do Vite)
      }

      // 3. Busca estado RPG do backend
      try {
        const state = await invoke<GameState>('get_game_state');
        setGame(state);
      } catch {
        // Comando pode não existir no backend ainda
      }
    };
    void init();
  }, []);

  /**
   * Chamado quando o usuário completa o Welcome (digita o nome).
   * Salva no localStorage e atualiza o estado.
   */
  const handleWelcomeComplete = (name: string) => {
    try {
      localStorage.setItem('nemesis.seenWelcome', '1');
      localStorage.setItem('nemesis.userName', name);
    } catch {
      // localStorage pode não estar disponível
    }
    setUserName(name);
    setHasSeenWelcome(true);
  };

  // Enquanto não carrega o estado do Welcome, não renderiza nada
  if (hasSeenWelcome === null) {
    return null;
  }

  return (
    <div className="app">
      {/* Se ainda não viu o Welcome, mostra tela de boas-vindas */}
      {!hasSeenWelcome ? (
        <Welcome onComplete={handleWelcomeComplete} />
      ) : (
        <>
          {/* Barra superior: brand (abre Sobre) + menu de usuário */}
          <header className="topbar">
            {/* Brand: ícone nemesis.jpg + nome — clique abre Sobre */}
            <div className="brand" onClick={() => setSobreOpen(true)}>
              <img src="/nemesis.jpg" alt="Nemesis" className="brand-icon" />
              <div>{appInfo ? appInfo.name : 'Nemesis'}</div>
            </div>

            {/* Menu de usuário: indicador ▾ abre dropdown com 3 opções */}
            <div className="account-group">
              <Account
                userName={userName || 'Usuário'}
                userRole="Jogador"
                avatar={userName ? userName.charAt(0).toUpperCase() : 'U'}
                onConfiguracoes={() => setConfiguracoesOpen(true)}
              />
            </div>
          </header>

          {/* Conteúdo principal: Hero (personagem) + Painel RPG */}
          <main className="main">
            <Hero />
            <RpgPanel
              level={game.level}
              xp={game.xp}
              xpToNext={game.xp_to_next}
              gold={game.gold}
              hp={game.hp}
              maxHp={game.max_hp}
            />
          </main>

          {/* Overlay Sobre — abre ao clicar no ícone Nemesis */}
          <Sobre isOpen={sobreOpen} onClose={() => setSobreOpen(false)} />

          {/* Overlay CriarNovoPerfil — esqueleto, não integrado ainda */}
          <CriarNovoPerfil
            isOpen={criarNovoPerfilOpen}
            onClose={() => setCriarNovoPerfilOpen(false)}
          />

          {/* Tela Configurações — "Em construção" (preta, clique fecha) */}
          <Configuracoes
            isOpen={configuracoesOpen}
            onClose={() => setConfiguracoesOpen(false)}
          />
        </>
      )}
    </div>
  );
}
