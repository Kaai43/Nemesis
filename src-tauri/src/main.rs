#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;

use serde::Serialize;
use tauri::{Manager, State};

// ---------------------------------------------------------------------------
// Módulos (esqueleto dos 5 skills solicitados)
// ---------------------------------------------------------------------------

// 4 · Idle RPG State Machine — estado autoritário do jogo (nível, XP, ouro, vida)
mod game_state;
// 3 · OS Hooks (Rust) — ganchos de nível de SO (idle, input, janela, hotkeys)
mod os_hooks;
// 5 · Vivaldi WS Bridge — ponte WebSocket para telemetria/automação do Vivaldi
mod vivaldi_bridge;

// Re-exporta para uso no setup/handlers
use game_state::GameState;
use os_hooks::OsHooks;

// ---------------------------------------------------------------------------
// 2 · Contrato Tauri IPC — comandos tipados expostos ao frontend
// ---------------------------------------------------------------------------

#[derive(Debug, Serialize, Clone)]
pub struct AppInfo {
    pub name: String,
    pub version: String,
}

#[derive(Debug, Serialize, Clone)]
pub struct RpgStatus {
    pub level: u32,
    pub xp: u32,
    pub xp_to_next: u32,
    pub gold: u32,
    pub hp: u32,
    pub max_hp: u32,
}

/// Retorna metadados da aplicação (ex.: nome e versão).
#[tauri::command]
fn get_app_info() -> AppInfo {
    AppInfo {
        name: env!("CARGO_PKG_NAME").into(),
        version: env!("CARGO_PKG_VERSION").into(),
    }
}

/// Retorna o estado RPG atual (projeção da máquina de estado autoritária).
#[tauri::command]
fn get_game_state(state: State<'_, Mutex<GameState>>) -> RpgStatus {
    let gs = state.lock().expect("game state lock");
    RpgStatus {
        level: gs.level,
        xp: gs.xp,
        xp_to_next: gs.xp_to_next,
        gold: gs.gold,
        hp: gs.hp,
        max_hp: gs.max_hp,
    }
}

fn main() {
    tauri::Builder::default()
        // Estado RPG gerenciado pelo backend (uma fonte autoritativa)
        .manage(Mutex::new(GameState::default()))
        // Ganchos de SO (idle, input, janela, atalhos globais)
        .manage(OsHooks::default())
        .plugin(tauri_plugin_log::Builder::default().build())
        .invoke_handler(tauri::generate_handler![get_app_info, get_game_state])
        .setup(|app| {
            // 3 · OS Hooks: aqui seria o registro de idle-monitor, active-window,
            // global-hotkeys e sleep/resume. Mantido como esqueleto para a próxima fase.
            let _window = app.get_webview_window("main");

            // 5 · Vivaldi WS Bridge: inicialização da ponte WebSocket (esqueleto).
            // vivaldi_bridge::start(app.handle());

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("erro ao executar o aplicativo Tauri")
}
