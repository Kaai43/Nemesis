// ---------------------------------------------------------------------------
<<<<<<< HEAD
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
=======
// Banco de dados local (PostgreSQL)
// ---------------------------------------------------------------------------
// Todas as informações do aplicativo são salvas localmente no computador do
// usuário usando PostgreSQL. O banco roda localmente (localhost:5432) e
// não envia dados para nenhum servidor externo.
//
// Para funcionar, o usuário precisa ter o PostgreSQL instalado localmente
// e uma base de dados chamada `nemesis` acessível.
// ---------------------------------------------------------------------------

use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::Mutex as TokioMutex;
use tokio_postgres::{NoTls, Client};
>>>>>>> a5307b1f7aaa65d698261560419d6bbd6589b6eb
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserProfile {
<<<<<<< HEAD
    pub id: String,
=======
    pub id: Uuid,
>>>>>>> a5307b1f7aaa65d698261560419d6bbd6589b6eb
    pub name: String,
    pub created_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GameSave {
<<<<<<< HEAD
    pub id: String,
    pub user_id: String,
=======
    pub id: Uuid,
    pub user_id: Uuid,
>>>>>>> a5307b1f7aaa65d698261560419d6bbd6589b6eb
    pub level: i32,
    pub xp: i32,
    pub xp_to_next: i32,
    pub gold: i32,
    pub hp: i32,
    pub max_hp: i32,
    pub updated_at: Option<String>,
}

<<<<<<< HEAD
/// Wrapper gerenciando a conexão com o SQLite.
pub struct Database {
    conn: Mutex<Option<Connection>>,
    db_path: PathBuf,
=======
/// Wrapper gerenciando a conexão com o PostgreSQL.
pub struct Database {
    client: TokioMutex<Option<Client>>,
>>>>>>> a5307b1f7aaa65d698261560419d6bbd6589b6eb
}

impl Database {
    pub fn new() -> Self {
<<<<<<< HEAD
        let db_path = dirs::data_dir()
            .map(|p| p.join("nemesis").join("nemesis.db"))
            .unwrap_or_else(|| PathBuf::from("nemesis.db"));

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
=======
        Database {
            client: TokioMutex::new(None),
        }
    }

    /// Tenta conectar ao PostgreSQL local e cria as tabelas se necessário.
    pub async fn connect(&self) -> Result<bool, String> {
        let (client, connection) = tokio_postgres::connect(
            "host=localhost port=5432 dbname=nemesis user=nemesis password=nemesis",
            NoTls,
        )
        .await
        .map_err(|e| format!("Não foi possível conectar ao PostgreSQL: {e}"))?;

        // Executa a conexão em background para manter viva
        tokio::spawn(async move {
            if let Err(e) = connection.await {
                eprintln!("Conexão PostgreSQL encerrada: {e}");
            }
        });

        self.create_tables(&client).await?;

        *self.client.lock().await = Some(client);
        Ok(true)
    }

    async fn create_tables(&self, client: &Client) -> Result<(), String> {
        client
            .execute(
                "CREATE TABLE IF NOT EXISTS users (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    name TEXT NOT NULL,
                    created_at TIMESTAMPTZ DEFAULT NOW()
                )",
                &[],
            )
            .await
            .map_err(|e| format!("Erro ao criar tabela users: {e}"))?;

        client
            .execute(
                "CREATE TABLE IF NOT EXISTS game_saves (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    level INTEGER NOT NULL DEFAULT 1,
                    xp INTEGER NOT NULL DEFAULT 0,
                    xp_to_next INTEGER NOT NULL DEFAULT 100,
                    gold INTEGER NOT NULL DEFAULT 0,
                    hp INTEGER NOT NULL DEFAULT 100,
                    max_hp INTEGER NOT NULL DEFAULT 100,
                    updated_at TIMESTAMPTZ DEFAULT NOW()
                )",
                &[],
            )
            .await
            .map_err(|e| format!("Erro ao criar tabela game_saves: {e}"))?;
>>>>>>> a5307b1f7aaa65d698261560419d6bbd6589b6eb

        Ok(())
    }

<<<<<<< HEAD
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
=======
    /// Salva ou atualiza o nome do usuário. Retorna o UUID do usuário.
    pub async fn save_user_name(&self, name: &str) -> Result<Uuid, String> {
        let guard = self.client.lock().await;
        let client = guard
            .as_ref()
            .ok_or_else(|| "Banco de dados não conectado".to_string())?;

        // Verifica se já existe um usuário
        let row = client
            .query_opt("SELECT id FROM users LIMIT 1", &[])
            .await
            .map_err(|e| format!("Erro ao consultar usuário: {e}"))?;

        match row {
            Some(row) => {
                let id: Uuid = row.get(0);
                client
                    .execute("UPDATE users SET name = $1 WHERE id = $2", &[&name, &id])
                    .await
                    .map_err(|e| format!("Erro ao atualizar nome: {e}"))?;
                Ok(id)
            }
            None => {
                let id: Uuid = client
                    .query_one(
                        "INSERT INTO users (name) VALUES ($1) RETURNING id",
                        &[&name],
                    )
                    .await
                    .map_err(|e| format!("Erro ao inserir usuário: {e}"))?
                    .get(0);
>>>>>>> a5307b1f7aaa65d698261560419d6bbd6589b6eb
                Ok(id)
            }
        }
    }

    /// Obtém o perfil do usuário salvo, se existir.
<<<<<<< HEAD
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
=======
    pub async fn get_user_profile(&self) -> Result<Option<UserProfile>, String> {
        let guard = self.client.lock().await;
        let client = guard
            .as_ref()
            .ok_or_else(|| "Banco de dados não conectado".to_string())?;

        let row = client
            .query_opt("SELECT id, name, created_at FROM users LIMIT 1", &[])
            .await
            .map_err(|e| format!("Erro ao consultar usuário: {e}"))?;

        Ok(row.map(|r| UserProfile {
            id: r.get(0),
            name: r.get(1),
            created_at: r.get::<_, Option<String>>(2),
>>>>>>> a5307b1f7aaa65d698261560419d6bbd6589b6eb
        }))
    }

    /// Salva o estado atual do jogo.
<<<<<<< HEAD
    pub fn save_game_state(
        &self,
        user_id: &str,
=======
    pub async fn save_game_state(
        &self,
        user_id: Uuid,
>>>>>>> a5307b1f7aaa65d698261560419d6bbd6589b6eb
        level: i32,
        xp: i32,
        xp_to_next: i32,
        gold: i32,
        hp: i32,
        max_hp: i32,
    ) -> Result<(), String> {
<<<<<<< HEAD
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
=======
        let guard = self.client.lock().await;
        let client = guard
            .as_ref()
            .ok_or_else(|| "Banco de dados não conectado".to_string())?;

        client
            .execute(
                "INSERT INTO game_saves (user_id, level, xp, xp_to_next, gold, hp, max_hp, updated_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
                 ON CONFLICT (id) DO UPDATE SET
                    level = EXCLUDED.level,
                    xp = EXCLUDED.xp,
                    xp_to_next = EXCLUDED.xp_to_next,
                    gold = EXCLUDED.gold,
                    hp = EXCLUDED.hp,
                    max_hp = EXCLUDED.max_hp,
                    updated_at = NOW()",
                &[
                    &user_id as &(dyn tokio_postgres::types::ToSql + Sync),
                    &level as &(dyn tokio_postgres::types::ToSql + Sync),
                    &xp as &(dyn tokio_postgres::types::ToSql + Sync),
                    &xp_to_next as &(dyn tokio_postgres::types::ToSql + Sync),
                    &gold as &(dyn tokio_postgres::types::ToSql + Sync),
                    &hp as &(dyn tokio_postgres::types::ToSql + Sync),
                    &max_hp as &(dyn tokio_postgres::types::ToSql + Sync),
                ],
            )
            .await
            .map_err(|e| format!("Erro ao salvar jogo: {e}"))?;

>>>>>>> a5307b1f7aaa65d698261560419d6bbd6589b6eb
        Ok(())
    }

    /// Obtém o último estado do jogo salvo para o usuário.
<<<<<<< HEAD
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
=======
    pub async fn get_game_save(&self, user_id: Uuid) -> Result<Option<GameSave>, String> {
        let guard = self.client.lock().await;
        let client = guard
            .as_ref()
            .ok_or_else(|| "Banco de dados não conectado".to_string())?;

        let row = client
            .query_opt(
                "SELECT id, user_id, level, xp, xp_to_next, gold, hp, max_hp, updated_at
                 FROM game_saves WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1",
                &[&user_id],
            )
            .await
            .map_err(|e| format!("Erro ao consultar save: {e}"))?;

        Ok(row.map(|r| GameSave {
            id: r.get(0),
            user_id: r.get(1),
            level: r.get(2),
            xp: r.get(3),
            xp_to_next: r.get(4),
            gold: r.get(5),
            hp: r.get(6),
            max_hp: r.get(7),
            updated_at: r.get::<_, Option<String>>(8),
        }))
>>>>>>> a5307b1f7aaa65d698261560419d6bbd6589b6eb
    }
}

impl Default for Database {
    fn default() -> Self {
        Self::new()
    }
}

<<<<<<< HEAD
/// Tipo gerenciado pelo Tauri State.
=======
/// Tipo gerenciado pelo Tauri State — usa Arc para ser compartilhado entre tarefas assíncronas.
>>>>>>> a5307b1f7aaa65d698261560419d6bbd6589b6eb
pub type DbState = Arc<Database>;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn database_creates_without_panic() {
        let db = Database::new();
<<<<<<< HEAD
        let _ = db.db_path;
=======
        // TokioMutex não é síncrono, apenas verificamos que não dá pânico ao criar
        let _ = db;
>>>>>>> a5307b1f7aaa65d698261560419d6bbd6589b6eb
    }
}
