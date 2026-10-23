// ---------------------------------------------------------------------------
// 3 · OS Hooks (Rust)
//
// Pontos de extensão para hooks de nível de sistema operacional:
//   * Idle / AFK detection
//   * Global input activity (teclado/mouse)
//   * Active window / foreground app tracking
//   * Global hotkeys / atalhos globais
//   • Sleep / resume events
//
// Implementações nativas por plataforma (Linux X11/Wayland, Windows, macOS)
// serão adicionadas na próxima fase, mantendo a camada de baixo perfil e
// com foco em privacidade (sem gravação de teclas sensíveis).
// ---------------------------------------------------------------------------

#[derive(Debug, Default, Clone)]
pub struct OsHooks {
    pub idle_seconds: u64,
    pub active: bool,
}

impl OsHooks {
    pub fn attach_to_window(_window: Option<&tauri::WebviewWindow>) {
        // Esqueleto: registrar listeners de idle/foco aqui.
        println!("os_hooks: esqueleto inicializado (sem hook nativo ainda)");
    }

    pub fn mark_activity(&mut self) {
        self.idle_seconds = 0;
        self.active = true;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mark_activity_resets_idle() {
        let mut hooks = OsHooks::default();
        hooks.idle_seconds = 120;
        hooks.mark_activity();
        assert_eq!(hooks.idle_seconds, 0);
        assert!(hooks.active);
    }
}
