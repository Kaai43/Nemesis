#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::{Arc, Mutex};

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
// 6 · Banco de dados local (PostgreSQL)
mod database;

use database::DbState;

// Re-exporta para uso no setup/handlers
use game_state::GameState;
use os_hooks::OsHooks;
use database::Database;

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

#[derive(Debug, Serialize)]
pub struct SaveUserNameResponse {
    pub success: bool,
    pub user_id: Option<String>,
    pub message: String,
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

/// Salva o nome do usuário no PostgreSQL local.
#[tauri::command]
async fn save_user_name(db: State<'_, DbState>, user_name: String) -> Result<SaveUserNameResponse, String> {
    match db.save_user_name(&user_name).await {
        Ok(user_id) => Ok(SaveUserNameResponse {
            success: true,
            user_id: Some(user_id.to_string()),
            message: "Nome salvo com sucesso.".into(),
        }),
        Err(e) => Ok(SaveUserNameResponse {
            success: false,
            user_id: None,
            message: e,
        }),
    }
}

fn main() {
    tauri::Builder::default()
        // Estado RPG gerenciado pelo backend (uma fonte autoritativa)
        .manage(Mutex::new(GameState::default()))
        // Ganchos de SO (idle, input, janela, atalhos globais)
        .manage(OsHooks::default())
        // Banco de dados local (PostgreSQL) — compartilhado entre tarefas async
        .manage(Arc::new(Database::new()) as DbState)
        .invoke_handler(tauri::generate_handler![
            get_app_info,
            get_game_state,
            save_user_name
        ])
        .setup(|app| {
            let app_handle = app.handle();

            // 3 · OS Hooks: aqui seria o registro de idle-monitor, active-window,
            // global-hotkeys e sleep/resume. Mantido como esqueleto para a próxima fase.
            let _window = app.get_webview_window("main");

            // 5 · Vivaldi WS Bridge: inicialização da ponte WebSocket (esqueleto).
            // vivaldi_bridge::start(app_handle.clone());

            // 6 · Banco de dados: tenta conectar ao PostgreSQL local.
            // Se não estiver disponível, o app continua em modo degradado (memória apenas).
            let db_state: DbState = app_handle.state::<DbState>().inner().clone();
            tauri::async_runtime::spawn(async move {
                match db_state.connect().await {
                    Ok(true) => {
                        println!("[nemesis] PostgreSQL conectado com sucesso.");
                    }
                    Ok(false) => {
                        println!("[nemesis] PostgreSQL não disponível. Modo degradado (memória apenas).");
                    }
                    Err(e) => {
                        eprintln!("[nemesis] Erro ao conectar ao PostgreSQL: {e}");
                    }
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("erro ao executar o aplicativo Tauri")
}
