const { invoke } = window.__TAURI__.core;
const { save, open } = window.__TAURI_PLUGIN_DIALOG__;

const editor = document.getElementById('editor');

// Function to handle Saving
async function handleSave() {
  try {
    // 1. Open the Native Save Dialog
    const path = await save({
      filters: [{ name: 'Text', extensions: ['txt', 'md'] }]
    });

    if (path) {
      // 2. Call our Rust backend 'save_file' command
      await invoke('save_file', { path, content: editor.value });
      console.log("File saved successfully!");
    }
  } catch (err) {
    console.error("Save Error:", err);
  }
}

// Function to handle Opening
async function handleOpen() {
  try {
    const path = await open({
      multiple: false,
      filters: [{ name: 'Text', extensions: ['txt', 'md'] }]
    });

    if (path) {
      // Call our Rust backend 'open_file' command
      const content = await invoke('open_file', { path });
      editor.value = content;
    }
  } catch (err) {
    console.error("Open Error:", err);
  }
}

// Keyboard Shortcuts (Architecting the "Listeners")
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    handleSave();
  }
  if (e.ctrlKey && e.key === 'o') {
    e.preventDefault();
    handleOpen();
  }
});