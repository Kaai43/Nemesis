use serde::{Deserialize, Serialize};

// ---------------------------------------------------------------------------
// 4 · Idle RPG State Machine
//
// Regras:
//   * Uma única fonte autoritativa de estado (GameState).
//   * Ticks determinísticos: advance/grant_xp só mutam por regras puras.
//   * Save/versionamento preparado para a próxima fase.
// ---------------------------------------------------------------------------

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
pub struct GameState {
    pub level: u32,
    pub xp: u32,
    pub xp_to_next: u32,
    pub gold: u32,
    pub hp: u32,
    pub max_hp: u32,
}

impl GameState {
    pub const XP_PER_LEVEL_BASE: u32 = 100;

    /// Concede XP e sobe de nível quando ultrapassa o limite (determinístico).
    pub fn grant_xp(&mut self, amount: u32) {
        let mut remaining = amount;
        while remaining > 0 {
            let space = self.xp_to_next.saturating_sub(self.xp);
            let take = remaining.min(space);
            self.xp = self.xp.saturating_add(take);
            remaining = remaining.saturating_sub(take);

            if self.xp >= self.xp_to_next {
                self.level_up();
            } else {
                break;
            }
        }
    }

    fn level_up(&mut self) {
        self.level = self.level.saturating_add(1);
        self.xp = 0;
        // Fórmula simples: cada nível custa 50% a mais de XP.
        self.xp_to_next = (Self::XP_PER_LEVEL_BASE
            * self.level
            * (100u32.saturating_add((self.level - 1) * 50) / 100))
        .max(100);
        self.gold = self.gold.saturating_add(10 * self.level);
        self.max_hp = 100 + (self.level - 1) * 10;
        self.hp = self.max_hp;
    }

    /// Tick passivo (idle): regeneração leve de vida por tick.
    pub fn tick_idle(&mut self) {
        if self.hp < self.max_hp {
            self.hp = self.hp.saturating_add(1).min(self.max_hp);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn grant_xp_levels_up() {
        let mut gs = GameState::default();
        assert_eq!(gs.level, 1);
        gs.grant_xp(150);
        assert!(gs.level > 1);
    }

    #[test]
    fn hp_capped_at_max() {
        let mut gs = GameState::default();
        gs.hp = gs.max_hp;
        gs.tick_idle();
        assert_eq!(gs.hp, gs.max_hp);
    }
}
