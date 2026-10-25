// ---------------------------------------------------------------------------
// Level — esqueleto do sistema de nível (preparação para 0.2.0)
// ---------------------------------------------------------------------------
// IMPORTANTE: este componente NÃO está integrado em nenhuma tela.
// Ele não é importado pelo App, portanto nada dele aparece no aplicativo.
//
// Na 0.2.0 ele será responsável por:
//   * exibir o nível atual e a barra de XP;
//   * calcular progressão (XP necessário por nível);
//   * reagir a eventos da Idle RPG State Machine (game_state.rs);
//   * animar subida de nível e recompensas (ouro/vida).
// ---------------------------------------------------------------------------

interface LevelProps {
  /** Nível atual do usuário. */
  level: number;
  /** XP acumulado no nível atual. */
  xp: number;
  /** XP necessário para o próximo nível. */
  xpToNext: number;
}

/**
 * Esqueleto do painel de Level/XP.
 * Mantido sem integração nesta versão — nada é renderizado no app.
 */
export function Level({ level, xp, xpToNext }: LevelProps) {
  // Percentual de progresso no nível atual (0–100)
  const pct = xpToNext > 0 ? Math.min(100, (xp / xpToNext) * 100) : 0;

  return (
    <div className="level-panel">
      {/* Cabeçalho: nível atual */}
      <div className="level-header">
        <span className="level-title">Nível</span>
        <span className="level-value">{level}</span>
      </div>

      {/* Barra de XP */}
      <div className="level-track">
        <div className="level-fill" style={{ width: `${pct}%` }} />
      </div>

      {/* Texto de XP */}
      <div className="level-text">
        {xp} / {xpToNext} XP
      </div>

      {/* =================================================================
         ESQUELETO (0.2.0)
         Aqui entrarão: recompensas ao subir de nível, animações,
         bônus de ouro/vida e integração com game_state.rs.
         ================================================================= */}
    </div>
  );
}
