// ---------------------------------------------------------------------------
// RpgPanel — painel de progresso RPG
// ---------------------------------------------------------------------------
// Exibe nível, XP (barra de progresso), ouro e vida do usuário.
// Recebe o estado do jogo como props (projeção do GameState do backend).
// ---------------------------------------------------------------------------

/** Props do painel RPG — valores vindos do backend via App.tsx. */
interface RpgPanelProps {
  /** Nível atual do usuário. */
  level: number;
  /** XP acumulado no nível atual. */
  xp: number;
  /** XP necessário para subir de nível. */
  xpToNext: number;
  /** Quantidade de ouro acumulada. */
  gold: number;
  /** Vida atual. */
  hp: number;
  /** Vida máxima. */
  maxHp: number;
}

/**
 * Componente RpgPanel — card lateral com progresso do usuário.
 * Mostra barras de progresso para XP e vida, além de nível e ouro.
 */
export function RpgPanel({ level, xp, xpToNext, gold, hp, maxHp }: RpgPanelProps) {
  // Calcula porcentagem da barra de XP (0-100%)
  const xpPct = xpToNext > 0 ? Math.min(100, (xp / xpToNext) * 100) : 0;
  // Calcula porcentagem da barra de vida (0-100%)
  const hpPct = maxHp > 0 ? Math.min(100, (hp / maxHp) * 100) : 0;

  return (
    <div className="rpg-panel">
      <div className="card">
        {/* Cabeçalho do card: título + nível atual */}
        <div className="card-header">
          <div className="card-title">
            <span className="icon">⚔</span>
            Progresso RPG
          </div>
          <span className="value level">Nv {level}</span>
        </div>

        {/* Stat: Nível */}
        <div className="rpg-stat level">
          <div className="label">Nível</div>
          <div className="value level">{level}</div>
        </div>

        {/* Stat: Experiência com barra de progresso */}
        <div className="rpg-stat">
          <div className="label">Experiência</div>
          <div className="xp-track">
            <div className="xp-fill" style={{ width: `${xpPct}%` }} />
          </div>
          <div className="xp-text">{xp} / {xpToNext} XP</div>
        </div>

        {/* Stat: Ouro */}
        <div className="rpg-stat gold">
          <div className="label">Ouro</div>
          <div className="value gold">{gold}</div>
        </div>

        {/* Stat: Vida com barra de progresso (vermelha) */}
        <div className="rpg-stat">
          <div className="label">Vida</div>
          <div className="xp-track" style={{ marginTop: 6 }}>
            <div
              className="xp-fill"
              style={{ width: `${hpPct}%`, background: 'linear-gradient(90deg, #ef4444, #f87171)' }}
            />
          </div>
          <div className="xp-text">{hp} / {maxHp} HP</div>
        </div>

        {/* Seção: Status do MVP */}
        <div className="section-title" style={{ marginTop: 18 }}>
          Status do MVP
        </div>
        <div className="rpg-stat">
          <div className="label">Build</div>
          <div className="value">Gráficos</div>
        </div>
        <div className="rpg-stat">
          <div className="label">Integrações</div>
          <div className="value">Em breve</div>
        </div>
      </div>
    </div>
  );
}
