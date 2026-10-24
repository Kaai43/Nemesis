// ---------------------------------------------------------------------------
// Banco de dados local (SQLite)
// ---------------------------------------------------------------------------
// Todas as informações do aplicativo são salvas localmente no computador do
// usuário usando SQLite. O banco é um arquivo embutido (nemesis.db) que não
// requer nenhum servidor externo — tudo fica apenas neste computador.
// ---------------------------------------------------------------------------

use rusqlite::{params, OptionalExtension, Connection};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserProfile {
    pub id: String,
    pub name: String,
    pub created_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GameSave {
    pub id: String,
    pub user_id: String,
    pub level: i32,
    pub xp: i32,
    pub xp_to_next: i32,
    pub gold: i32,
    pub hp: i32,
    pub max_hp: i32,
    pub updated_at: Option<String>,
}

/// Wrapper gerenciando a conexão com o SQLite.
pub struct Database {
    conn: Mutex<Option<Connection>>,
    db_path: PathBuf,
}

impl Database {
    pub fn new() -> Self {
        // Usa o diretório home do usuário para guardar o banco de dados
        let home = std::env::var("HOME").unwrap_or_else(|_| ".".to_string());
        let db_path = PathBuf::from(format!("{}/.nemesis.db", home));

        if let Some(parent) = db_path.parent() {
            let _ = std::fs::create_dir_all(parent);
        }

        Database {
            conn: Mutex::new(None),
            db_path,
        }
    }

    /// Conecta ao SQLite e cria as tabelas se necessário.
    pub fn connect(&self) -> Result<bool, String> {
        let conn = Connection::open(&self.db_path)
            .map_err(|e| format!("Não foi possível abrir o banco SQLite: {e}"))?;

        self.create_tables(&conn)?;

        *self.conn.lock().expect("db lock") = Some(conn);
        Ok(true)
    }

    fn create_tables(&self, conn: &Connection) -> Result<(), String> {
        conn.execute(
            "CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )",
            [],
        )
        .map_err(|e| format!("Erro ao criar tabela users: {e}"))?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS game_saves (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                level INTEGER NOT NULL DEFAULT 1,
                xp INTEGER NOT NULL DEFAULT 0,
                xp_to_next INTEGER NOT NULL DEFAULT 100,
                gold INTEGER NOT NULL DEFAULT 0,
                hp INTEGER NOT NULL DEFAULT 100,
                max_hp INTEGER NOT NULL DEFAULT 100,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )",
            [],
        )
        .map_err(|e| format!("Erro ao criar tabela game_saves: {e}"))?;

        Ok(())
    }

    /// Salva ou atualiza o nome do usuário. Retorna o ID do usuário.
    pub fn save_user_name(&self, name: &str) -> Result<String, String> {
        let guard = self.conn.lock().expect("db lock");
        let conn = guard
            .as_ref()
            .ok_or_else(|| "Banco de dados não conectado".to_string())?;

        let existing: Option<String> = conn
            .query_row("SELECT id FROM users LIMIT 1", [], |row| row.get(0))
            .optional()
            .map_err(|e| format!("Erro ao consultar usuário: {e}"))?;

        match existing {
            Some(id) => {
                conn.execute("UPDATE users SET name = ?1 WHERE id = ?2", params![name, id])
                    .map_err(|e| format!("Erro ao atualizar nome: {e}"))?;
                drop(guard);
                Ok(id)
            }
            None => {
                let id = Uuid::new_v4().to_string();
                conn.execute(
                    "INSERT INTO users (id, name) VALUES (?1, ?2)",
                    params![id, name],
                )
                .map_err(|e| format!("Erro ao inserir usuário: {e}"))?;
                drop(guard);
                Ok(id)
            }
        }
    }

    /// Obtém o perfil do usuário salvo, se existir.
    pub fn get_user_profile(&self) -> Result<Option<UserProfile>, String> {
        let guard = self.conn.lock().expect("db lock");
        let conn = guard
            .as_ref()
            .ok_or_else(|| "Banco de dados não conectado".to_string())?;

        let row: Option<(String, String, Option<String>)> = conn
            .query_row("SELECT id, name, created_at FROM users LIMIT 1", [], |row| {
                Ok((row.get(0)?, row.get(1)?, row.get(2)?))
            })
            .optional()
            .map_err(|e| format!("Erro ao consultar usuário: {e}"))?;

        drop(guard);
        Ok(row.map(|(id, name, created_at)| UserProfile {
            id,
            name,
            created_at,
        }))
    }

    /// Salva o estado atual do jogo.
    pub fn save_game_state(
        &self,
        user_id: &str,
        level: i32,
        xp: i32,
        xp_to_next: i32,
        gold: i32,
        hp: i32,
        max_hp: i32,
    ) -> Result<(), String> {
        let guard = self.conn.lock().expect("db lock");
        let conn = guard
            .as_ref()
            .ok_or_else(|| "Banco de dados não conectado".to_string())?;

        let existing: Option<String> = conn
            .query_row(
                "SELECT id FROM game_saves WHERE user_id = ?1 ORDER BY updated_at DESC LIMIT 1",
                params![user_id],
                |row| row.get(0),
            )
            .optional()
            .map_err(|e| format!("Erro ao consultar save: {e}"))?;

        match existing {
            Some(save_id) => {
                conn.execute(
                    "UPDATE game_saves SET level = ?1, xp = ?2, xp_to_next = ?3, gold = ?4, hp = ?5, max_hp = ?6, updated_at = CURRENT_TIMESTAMP WHERE id = ?7",
                    params![level, xp, xp_to_next, gold, hp, max_hp, save_id],
                )
                .map_err(|e| format!("Erro ao atualizar jogo: {e}"))?;
            }
            None => {
                let id = Uuid::new_v4().to_string();
                conn.execute(
                    "INSERT INTO game_saves (id, user_id, level, xp, xp_to_next, gold, hp, max_hp) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
                    params![id, user_id, level, xp, xp_to_next, gold, hp, max_hp],
                )
                .map_err(|e| format!("Erro ao inserir save: {e}"))?;
            }
        }

        drop(guard);
        Ok(())
    }

    /// Obtém o último estado do jogo salvo para o usuário.
    pub fn get_game_save(&self, user_id: &str) -> Result<Option<GameSave>, String> {
        let guard = self.conn.lock().expect("db lock");
        let conn = guard
            .as_ref()
            .ok_or_else(|| "Banco de dados não conectado".to_string())?;

        let row: Option<(String, String, i32, i32, i32, i32, i32, i32, Option<String>)> = conn
            .query_row(
                "SELECT id, user_id, level, xp, xp_to_next, gold, hp, max_hp, updated_at
                 FROM game_saves WHERE user_id = ?1 ORDER BY updated_at DESC LIMIT 1",
                params![user_id],
                |row| {
                    Ok((
                        row.get(0)?,
                        row.get(1)?,
                        row.get(2)?,
                        row.get(3)?,
                        row.get(4)?,
                        row.get(5)?,
                        row.get(6)?,
                        row.get(7)?,
                        row.get(8)?,
                    ))
                },
            )
            .optional()
            .map_err(|e| format!("Erro ao consultar save: {e}"))?;

        drop(guard);
        Ok(row.map(
            |(id, user_id, level, xp, xp_to_next, gold, hp, max_hp, updated_at)| GameSave {
                id,
                user_id,
                level,
                xp,
                xp_to_next,
                gold,
                hp,
                max_hp,
                updated_at,
            },
        ))
    }
}

impl Default for Database {
    fn default() -> Self {
        Self::new()
    }
}

/// Tipo gerenciado pelo Tauri State.
pub type DbState = Arc<Database>;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn database_creates_without_panic() {
        let db = Database::new();
        let _ = db.db_path;
    }
}
