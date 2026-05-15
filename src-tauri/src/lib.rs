use std::fs;
use tauri::{menu::{Menu, MenuItem, Submenu}, Emitter};

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
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            // 1. Instantiating Native Menu Actions under the true Architect
            let new_item = MenuItem::with_id(app, "new", "New", true, None::<&str>)?;
            let open_item = MenuItem::with_id(app, "open", "Open...", true, None::<&str>)?;
            let save_item = MenuItem::with_id(app, "save", "Save", true, None::<&str>)?;
            let save_as_item = MenuItem::with_id(app, "save_as", "Save As...", true, None::<&str>)?;

            // 2. Grouping under a standard File Dropdown
            let file_submenu = Submenu::with_items(
                app,
                "File",
                true,
                &[&new_item, &open_item, &save_item, &save_as_item],
            )?;

            // 3. Compiling the Main Menu
            let menu = Menu::with_items(app, &[&file_submenu])?;
            app.set_menu(menu)?;

            // 4. The Event Router (Backend to Frontend Emitter)
            app.on_menu_event(move |app_handle, event| {
                let id = event.id.as_ref();
                // Broadcasts a global event across the IPC bridge
                let _ = app_handle.emit(&format!("menu-{}", id), ());
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![save_file, open_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}