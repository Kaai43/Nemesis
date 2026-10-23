# Nemesis

MVP visual de um app **Tauri v2 + React** com tema escuro padrão, área de conta no canto superior direito, aviso "Em Construção" no centro e um painel de progresso RPG ao lado.

Este esqueleto já contempla a orientação das 5 skills:
1. **Tauri IPC Contract** — comandos tipados (`get_app_info`, `get_game_state`) expostos ao frontend via `invoke`.
2. **Surgical Diff Coder** — alterações mínimas, escopadas e revisáveis; nada de dependências desnecessárias.
3. **OS Hooks (Rust)** — módulo `os_hooks.rs` preparado para idle/AFK, input global, janela ativa, atalhos globais e sleep/resume.
4. **Idle RPG State Machine** — `game_state.rs`: estado autoritário, ticks determinísticos (`grant_xp`, `level_up`, `tick_idle`) com testes.
5. **Vivaldi WS Bridge** — módulo `vivaldi_bridge.rs` esqueleto para ponte WebSocket com o Vivaldi (próxima fase).

---

## Estrutura do projeto

```
Nemesis/
├── package.json              # frontend (Vite + React + TS)
├── vite.config.ts            # build do frontend -> ../dist
├── tsconfig.json
├── index.html
├── README.md
├── dist/                     # gerado por `npm run build` (feito)
├── src/                      # frontend React
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css             # tema escuro (CSS vars)
│   └── components/
│       ├── Account.tsx       # conta (canto superior direito)
│       ├── Account.css
│       ├── Hero.tsx          # "Em construção"
│       └── RpgPanel.tsx      # nível, XP, ouro, vida
└── src-tauri/                # backend Rust (Tauri v2)
    ├── Cargo.toml
    ├── tauri.conf.json
    ├── icons/
    └── src/
        ├── main.rs           # setup, invoke handler, gerencia estado
        ├── game_state.rs     # máquina de estado RPG
        ├── os_hooks.rs       # ganchos de SO (esqueleto)
        └── vivaldi_bridge.rs # ponte Vivaldi (esqueleto)
```

---

## Pré-requisitos (na sua máquina Linux)

- **Node.js** ≥ 18 e **npm**
- **Rust** (via rustup): `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y`
- **Tauri CLI**: `cargo install tauri-cli --version 2`

## Dependências de sistema (Linux / Debian/Ubuntu) — exigem `sudo`

O backend Tauri precisa dos cabeçalhos de desenvolvimento do WebKitGTK/dbus. No Debian/Ubuntu:

```bash
sudo apt-get update
sudo apt-get install -y \
  pkg-config \
  libdbus-1-dev \
  libwebkit2gtk-4.0-dev \
  libjavascriptcoregtk-4.0-dev \
  libgtk-3-dev \
  libappindicator3-dev \
  librsvg2-dev \
  patchelf \
  curl wget
```

Para gerar **AppImage**, o bundler do Tauri no Linux usa `appimagetool` + `linuxdeploy`. Instale os binários (sem precisar de root, basta colocar no `PATH`):

```bash
# appimagetool
wget https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage
chmod +x appimagetool-x86_64.AppImage
sudo mv appimagetool-x86_64.AppImage /usr/local/bin/appimagetool

# linuxdeploy
wget https://github.com/linuxdeploy/linuxdeploy/releases/download/continuous/linuxdeploy-x86_64.AppImage
chmod +x linuxdeploy-x86_64.AppImage
sudo mv linuxdeploy-x86_64.AppImage /usr/local/bin/linuxdeploy
```

---

## Como buildar e gerar o AppImage

No diretório raiz do projeto (`Nemesis/`):

```bash
# 1) Instala dependências do frontend
npm install

# 2) Build do frontend (gera dist/ na raiz)
npm run build

# 3) Build do app Tauri e empacotamento (inclui AppImage se appimagetool/linuxdeploy estiverem presentes)
cd src-tauri
cargo tauri build
```

O AppImage resultante fica em:

```
src-tauri/target/release/bundle/appimage/nemesis_0.1.0_amd64.AppImage
```

Você pode executar diretamente:

```bash
chmod +x src-tauri/target/release/bundle/appimage/nemesis_0.1.0_amd64.AppImage
./src-tauri/target/release/bundle/appimage/nemesis_0.1.0_amd64.AppImage
```

---

## Estado deste esqueleto (MVP)

- ✅ Tema escuro como padrão (CSS variáveis em `src/index.css`)
- ✅ Barra superior com área de conta (canto superior direito) — componente `Account`
- ✅ Centro com "Em Construção" — componente `Hero`
- ✅ Painel RPG ao lado (Nível, XP, Ouro, Vida) — componente `RpgPanel`
- ✅ Frontend compila com `npm run build` (saída em `dist/`)
- ✅ Contratos de IPC tipados (`get_app_info`, `get_game_state`)
- ✅ Estado RPG autoritário com ticks determinísticos (`game_state.rs`)
- ✅ Módulos-esqueleto de OS Hooks e Vivaldi WS Bridge
- ⏳ Compilação do backend e geração do AppImage: bloqueada neste sandbox por falta de `root` para instalar `pkg-config` + dev-headers do WebKitGTK. Rode os comandos acima na sua máquina para completar.

---

## Próximos passos (integração)

- Conectar os comandos de IPC do Tauri ao estado RPG real.
- Implementar `os_hooks.rs` (idle/AFK, input global, janela ativa, atalhos).
- Implementar `vivaldi_bridge.rs` (extensão MV3 + canal WebSocket + reconexão).
- Salvar/carregar estado com versionamento (máquina de estado idle).
