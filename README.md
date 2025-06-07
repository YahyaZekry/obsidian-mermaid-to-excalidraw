# Mermaid to Excalidraw Converter (Obsidian Plugin) 🧉

_Fueled by Yerba Mate and a love for diagrams!_

This plugin for Obsidian allows you to convert Mermaid.js diagram code blocks into fully functional Excalidraw drawings with proper text labels and formatting.

## ✨ Features

- **Full Mermaid Conversion**: Convert any Mermaid diagram to a proper Excalidraw drawing
- **Text Labels**: All text labels from Mermaid diagrams are preserved and rendered correctly
- **Seamless Integration**: Works perfectly with the official Excalidraw plugin
- **Proper File Format**: Creates compressed `.excalidraw.md` files that are fully compatible
- **Easy to Use**: Simple command palette interface

## 🚀 What's New

This plugin now features:

- ✅ Complete Mermaid to Excalidraw conversion
- ✅ Proper text rendering in diagrams
- ✅ LZ-string compression for compatibility
- ✅ Full integration with official Excalidraw plugin
- ✅ Support for complex Mermaid diagrams (flowcharts, graphs, etc.)

## Based on Excalidraw's Work

This plugin utilizes and is inspired by the core functionality of the [`@excalidraw/mermaid-to-excalidraw`](https://github.com/excalidraw/mermaid-to-excalidraw) library.
The original library is licensed under the MIT License, Copyright (c) 2023 Excalidraw.

## 📦 Installation

### Option 1: Manual Installation

1.  **Download or Build the plugin** (See Development section below if building from source).
2.  **Copy Plugin Files:**
    - `main.js`
    - `manifest.json`
3.  **Create Plugin Folder:** In your Obsidian vault, go to `.obsidian/plugins/` and create a new folder named `mermaid-to-excalidraw`.
4.  **Paste Files:** Paste `main.js` and `manifest.json` into this new folder.
5.  **Enable Plugin:**
    - Open Obsidian settings.
    - Go to "Community Plugins".
    - Turn off "Restricted mode" if it's on.
    - Find "Mermaid to Excalidraw Converter" in the list and enable it.

### Option 2: BRAT (Beta Reviewers Auto-update Tool)

1. Install the BRAT plugin from Obsidian Community Plugins
2. Add this repository URL in BRAT settings
3. The plugin will be automatically installed and updated

## 🎯 How to Use

1.  Create or open a note in Obsidian.
2.  Write your Mermaid diagram code. For example:
    ```
    graph TD
        A[Start] --> B{Decision}
        B -->|Yes| C[Action 1]
        B -->|No| D[Action 2]
        C --> E[End]
        D --> E[End]
    ```
3.  **Select the entire Mermaid code** (this is important!).
4.  Open the Command Palette (default `Ctrl+P` or `Cmd+P`).
5.  Type "Convert Mermaid to New Excalidraw File" and select the command.
6.  A new file (e.g., `Converted-Mermaid-TIMESTAMP.excalidraw.md`) will be created in your vault.
7.  Open the new file and switch to Excalidraw view to see your converted diagram with full text labels!

## 🔧 Compatibility

- **Works with both plugins enabled**: You can use this plugin alongside the official Excalidraw plugin
- **Requires Excalidraw plugin**: The official Excalidraw plugin must be installed to view the converted files
- **Supports all Mermaid types**: Flowcharts, graphs, sequence diagrams, and more

## Development

1.  Clone this repository.
2.  Navigate to the `obsidian-mermaid-to-excalidraw` directory (or this directory if it's a standalone repo).
3.  Install dependencies: `npm install`
4.  Build the plugin: `npm run build`
    - This generates `main.js`.
5.  For development, you can use `npm run dev` to automatically rebuild on changes.

## License

This plugin is released under the MIT License. See the `LICENSE` file in the root of the original [mermaid-to-excalidraw project](https://github.com/excalidraw/mermaid-to-excalidraw) (which this plugin is based on and is part of).
The core conversion library is Copyright (c) 2023 Excalidraw.
