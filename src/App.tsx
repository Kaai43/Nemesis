import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Account } from './components/Account';
import { Hero } from './components/Hero';
import { RpgPanel } from './components/RpgPanel';


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

  useEffect(() => {
    const load = async () => {
      try {
        const info = await invoke<AppInfo>('get_app_info');
        setAppInfo(info);
      } catch {
        // Tauri ainda não está em execução (modo dev do Vite sem tauri) — valores padrão
      }
      try {
        const state = await invoke<GameState>('get_game_state');
        setGame(state);
      } catch {
        // Ignorar se o comando não existir no backend ainda
      }
    };
    void load();
  }, []);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="mark">N</div>
          <div>{appInfo ? appInfo.name : 'Nemesis'}</div>
        </div>
        <Account userName="Vitu" userRole="Desenvolvedor" avatar="V" />
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
    </div>
  );
}
