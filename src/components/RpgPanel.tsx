interface RpgPanelProps {
  level: number;
  xp: number;
  xpToNext: number;
  gold: number;
  hp: number;
  maxHp: number;
}

export function RpgPanel({ level, xp, xpToNext, gold, hp, maxHp }: RpgPanelProps) {
  const xpPct = xpToNext > 0 ? Math.min(100, (xp / xpToNext) * 100) : 0;
  const hpPct = maxHp > 0 ? Math.min(100, (hp / maxHp) * 100) : 0;

  return (
    <div className="rpg-panel">
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <span className="icon">⚔</span>
            Progresso RPG
          </div>
          <span className="value level">Nv {level}</span>
        </div>

        <div className="rpg-stat level">
          <div className="label">Nível</div>
          <div className="value level">{level}</div>
        </div>

        <div className="rpg-stat">
          <div className="label">Experiência</div>
          <div className="xp-track">
            <div className="xp-fill" style={{ width: `${xpPct}%` }} />
          </div>
          <div className="xp-text">{xp} / {xpToNext} XP</div>
        </div>

        <div className="rpg-stat gold">
          <div className="label">Ouro</div>
          <div className="value gold">{gold}</div>
        </div>

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
