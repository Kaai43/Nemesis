// ---------------------------------------------------------------------------
// 5 · Vivaldi WS Bridge
//
// Ponte WebSocket entre este app Tauri e o Vivaldi (ou outro Chromium)
// para telemetria de abas, foco de janela e automação.
//
// Escopo desta fase: apenas o esqueleto do módulo. A conexão real (extensão
// MV3 + canal WS + reconexão + segurança) será conectada na próxima iteração.
// ---------------------------------------------------------------------------

#[derive(Debug, Default)]
pub struct VivaldiBridge {
    pub connected: bool,
}

impl VivaldiBridge {
    pub fn start() -> tauri::Result<()> {
        println!("vivaldi_bridge: esqueleto — ponte WebSocket não iniciada nesta MVP");
        Ok(())
    }
}
