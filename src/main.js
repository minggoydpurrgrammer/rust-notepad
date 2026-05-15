const { invoke } = window.__TAURI__.core;
const { listen } = window.__TAURI__.event;

// Defensive fallback resolution for the Tauri Dialog Plugin depending on context loading
const dialogPlugin = window.__TAURI_PLUGIN_DIALOG__ || 
                     (window.__TAURI__.plugins ? window.__TAURI__.plugins.dialog : null);

const editor = document.getElementById('editor');
let currentFilePath = null; // High-level client state: holds our active document URI

// --- 1. CORE BUSINESS LOGIC (Decoupled Handlers) ---

async function executeDirectSave() {
  console.log("executeDirectSave invoked...");
  if (currentFilePath) {
    try {
      // Direct file commit bypassing the picker OS UI
      await invoke('save_file', { path: currentFilePath, content: editor.value });
      console.log(`Changes written directly to disk at: ${currentFilePath}`);
    } catch (err) {
      console.error("Direct Write Core Error:", err);
    }
  } else {
    // Edge-case route: No file context exists yet, force path picking
    await executeSaveAs();
  }
}

async function executeOpen() {
  console.log("executeOpen invoked...");
  if (!dialogPlugin) {
    console.error("IPC Bridge Exception: Dialog plugin context unresolved.");
    return;
  }
  try {
    const path = await dialogPlugin.open({
      multiple: false,
      filters: [{ name: 'Text', extensions: ['txt', 'md'] }]
    });

    if (path) {
      // Read binary stream converted to UTF-8 string on the backend engine
      const content = await invoke('open_file', { path });
      editor.value = content;
      currentFilePath = path; // Cache resource state locally
      console.log(`Document loaded state resolved: ${path}`);
    }
  } catch (err) {
    console.error("System Open IO Failure:", err);
  }
}

async function executeSaveAs() {
  console.log("executeSaveAs invoked...");
  if (!dialogPlugin) {
    console.error("IPC Bridge Exception: Dialog plugin context unresolved.");
    return;
  }
  try {
    const path = await dialogPlugin.save({
      filters: [{ name: 'Text', extensions: ['txt', 'md'] }]
    });

    if (path) {
      currentFilePath = path; // Map state tracking node to new path pointer
      await invoke('save_file', { path, content: editor.value });
      console.log(`Resource created and written: ${path}`);
    }
  } catch (err) {
    console.error("System Save As IO Failure:", err);
  }
}

// --- 2. ASYNC IPC CHANNEL INTERCEPTORS (System Menu Handlers) ---

listen('menu-new', () => {
  console.log("System Menu Event: 'menu-new' packet received.");
  if (editor.value === "" || confirm("Discard unsaved progress?")) {
    editor.value = "";
    currentFilePath = null;
    console.log("UI layout canvas and tracking reference reset.");
  }
});

listen('menu-open', () => { 
  console.log("System Menu Event: 'menu-open' packet received.");
  executeOpen(); 
});

listen('menu-save', () => { 
  console.log("System Menu Event: 'menu-save' packet received.");
  executeDirectSave(); 
});

listen('menu-save_as', () => { 
  console.log("System Menu Event: 'menu-save_as' packet received.");
  executeSaveAs(); 
});

// --- 3. DOM KEYBOARD LISTENERS (Local Overrides) ---

window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.code === 'KeyS') {
    e.preventDefault(); // Suppress standard browser-viewport behavior
    console.log("Local Keystroke Intercepted: Ctrl + S sequence mapped.");
    if (e.shiftKey) {
      executeSaveAs(); // Mapped explicitly to Ctrl + Shift + S
    } else {
      executeDirectSave(); // Mapped explicitly to Ctrl + S
    }
  }
  
  if (e.ctrlKey && e.code === 'KeyO') {
    e.preventDefault();
    console.log("Local Keystroke Intercepted: Ctrl + O sequence mapped.");
    executeOpen();
  }
});