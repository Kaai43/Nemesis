# Nemesis — Controlador Extremo de Estudos (Anti-TDAH)

**Nemesis** é um aplicativo desktop nativo (Rust + Tauri v2 + React) projetado para ajudar pessoas com TDAH a manter o foco nos estudos. Ele funciona como um controlador extremo de produtividade, rodando localmente no seu computador, sem enviar dados para servidores externos.

## Objetivo

Criar um ambiente de estudo livre de distrações, com:
- **Tela de boas-vindas** personalizada (primeira execução)
- **Tema escuro** como padrão para reduzir cansaço visual
- **Área de conta** no canto superior direito
- **Painel de progresso RPG** (nível, XP, ouro, vida) para gamificação de estudos
- **Persistência local** via PostgreSQL (tudo fica no seu PC)

## Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Rust + Tauri v2
- **Banco local:** PostgreSQL (tabelas `users` e `game_saves`)
- **Empacotamento:** AppImage (Linux)

## Primeira execução

Ao abrir o aplicativo pela primeira vez, aparece a tela:

> **Bem-vindo, como podemos te chamar?**

Você digita seu nome, clica em "Começar" e ele é salvo localmente (PostgreSQL ou `localStorage` como fallback).

## Estrutura

```
Nemesis/
├── src/                 # Frontend React
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css        # Tema escuro (CSS vars)
│   └── components/
│       ├── Account.tsx      # Conta (canto superior direito)
│       ├── Hero.tsx         # "Em construção"
│       ├── RpgPanel.tsx     # Nível, XP, ouro, vida
│       └── Welcome.tsx      # Tela de boas-vindas (primeira vez)
├── src-tauri/           # Backend Rust (Tauri v2)
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   ├── build.rs
│   ├── icons/
│   └── src/
│       ├── main.rs          # IPC + setup + PostgreSQL
│       ├── game_state.rs    # Máquina de estado RPG (idle)
│       ├── os_hooks.rs      # Ganchos de SO (esqueleto)
│       ├── vivaldi_bridge.rs# Ponte Vivaldi (esqueleto)
│       └── database.rs      # PostgreSQL local (users, game_saves)
├── dist/                # Build do frontend (gerado)
└── README.md
```

## Como buildar (Linux)

```bash
# Pré-requisitos: Node.js, Rust, cargo-tauri, pkg-config e dev-headers (webkit, gtk, dbus, etc.)
npm install
npm run build
cd src-tauri
cargo tauri build
```

O AppImage será gerado em:
`src-tauri/target/release/bundle/appimage/Nemesis_0.1.0_amd64.AppImage`

## PostgreSQL (opcional, para persistência completa)

```bash
sudo apt-get install -y postgresql postgresql-contrib
sudo -u postgres psql -c "CREATE USER nemesis WITH PASSWORD 'nemesis';"
sudo -u postgres psql -c "CREATE DATABASE nemesis OWNER nemesis;"
sudo -u postgres psql -d nemesis -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
```

Se o PostgreSQL não estiver disponível, o app continua funcionando em modo degradado (dados apenas na memória/localStorage).

## Licença

Privado — uso pessoal.
