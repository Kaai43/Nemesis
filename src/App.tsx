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

interface AppInfo {
  name: string;
  version: string;
}

interface GameState {
  level: number;
  xp: number;
  xp_to_next: number;
  gold: number;
  hp: number;
  max_hp: number;
}

export default function App() {
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [game, setGame] = useState<GameState>({
    level: 1,
    xp: 0,
    xp_to_next: 100,
    gold: 0,
    hp: 100,
    max_hp: 100,
  });
  const [userName, setUserName] = useState<string | null>(null);
  const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean | null>(null);
  const [sobreOpen, setSobreOpen] = useState(false);
  const [criarNovoPerfilOpen, setCriarNovoPerfilOpen] = useState(false);
  const [configuracoesOpen, setConfiguracoesOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
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

      try {
        const info = await invoke<AppInfo>('get_app_info');
        setAppInfo(info);
      } catch {
        // Tauri ainda não está em execução (modo dev do Vite sem tauri)
      }
      try {
        const state = await invoke<GameState>('get_game_state');
        setGame(state);
      } catch {
        // Ignorar se o comando não existir no backend ainda
      }
    };
    void init();
  }, []);

  const handleWelcomeComplete = (name: string) => {
    try {
      localStorage.setItem('nemesis.seenWelcome', '1');
      localStorage.setItem('nemesis.userName', name);
    } catch {
      // localStorage pode não estar disponível em alguns ambientes
    }
    setUserName(name);
    setHasSeenWelcome(true);
  };

  // Se ainda não carregou o estado de welcome, não renderiza nada
  if (hasSeenWelcome === null) {
    return null;
  }

  return (
    <div className="app">
      {!hasSeenWelcome ? (
        <Welcome onComplete={handleWelcomeComplete} />
      ) : (
        <>
          <header className="topbar">
            <div className="brand" onClick={() => setSobreOpen(true)}>
              <img src="/nemesis.jpg" alt="Nemesis" className="brand-icon" />
              <div>{appInfo ? appInfo.name : 'Nemesis'}</div>
            </div>

            <div className="account-group">
              <Account
                userName={userName || 'Usuário'}
                userRole="Jogador"
                avatar={userName ? userName.charAt(0).toUpperCase() : 'U'}
                onConfiguracoes={() => setConfiguracoesOpen(true)}
              />
            </div>
          </header>

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

          {/* Sobre — aba aberta ao clicar no ícone Nemesis ou no menu conta > Sobre */}
          <Sobre isOpen={sobreOpen} onClose={() => setSobreOpen(false)} />

          {/* Criar Novo Perfil — esqueleto, ainda não integrado na conta */}
          <CriarNovoPerfil
            isOpen={criarNovoPerfilOpen}
            onClose={() => setCriarNovoPerfilOpen(false)}
          />

          {/* Configurações — esqueleto, ainda não implementado */}
          <Configuracoes
            isOpen={configuracoesOpen}
            onClose={() => setConfiguracoesOpen(false)}
          />
        </>
      )}
    </div>
  );
}
