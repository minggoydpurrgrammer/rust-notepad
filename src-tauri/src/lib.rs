use std::fs;

// 1. Define your backend "API" endpoints
#[tauri::command]
fn save_file(path: String, content: String) -> Result<(), String> {
    fs::write(path, content).map_err(|e| e.to_string())
}

#[tauri::command]
fn open_file(path: String) -> Result<String, String> {
    fs::read_to_string(path).map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        // 2. Register your commands here so the Frontend can "see" them
        .invoke_handler(tauri::generate_handler![save_file, open_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}