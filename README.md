# 🦀 Rust Notepad (Minimalist)

A lightweight, distraction-free desktop text editor. This project explores the **Microservices-style architecture** of Tauri, utilizing a high-performance **Rust backend** for File I/O and a lean **Vanilla JS/CSS** frontend for the UI.

## 🚀 Key Features
*   **Minimalist UI:** No toolbars, no distractions. Just your text.
*   **High Performance:** Optimized Rust backend for near-instant file operations.
*   **Ultra-Lightweight:** Target binary size between 2MB–10MB.
*   **Native Integration:** Uses Windows 11 native dialogs for a seamless OS experience.

## 🛠 Tech Stack
| Component | Technology |
| :--- | :--- |
| **Core Engine** | Rust (Systems Programming) |
| **Windowing** | Tauri v2 |
| **Frontend** | Vanilla HTML5, CSS3, JavaScript |
| **Environment** | Windows 11 Pro |

## 🏗 Architectural Overview
This project leverages Tauri's **Inter-Process Communication (IPC)**. The frontend acts as a "Client" that sends commands to the Rust "Server" (Backend), ensuring that sensitive operations like File System access remain within the memory-safe Rust boundary.

## 🚦 Getting Started
1. **Clone the repo:** `git clone https://github.com/your-username/rust-notepad.git`
2. **Install dependencies:** `npm install`
3. **Run in Dev Mode:** `npm run tauri dev`
4. **Build Production Binary:** `npm run tauri build`

## ⚖ License
MIT
