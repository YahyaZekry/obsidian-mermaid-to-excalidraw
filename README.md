# Mermaid to Excalidraw Converter (Obsidian Plugin) 🧉

_Fueled by Yerba Mate and a love for diagrams!_

This plugin for Obsidian allows you to convert Mermaid.js diagram code blocks into fully functional Excalidraw drawings with proper text labels and formatting.

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/yahyazekry)

## ✨ Features

- **Full Mermaid Conversion**: Convert any Mermaid diagram to a proper Excalidraw drawing
- **Bulk Conversion**: Convert all Mermaid diagrams in a file at once with the ribbon icon
- **Multiple Diagram Types**: Supports flowcharts, sequence diagrams, gantt charts, state diagrams, ER diagrams, pie charts, journey maps, requirement diagrams, timelines, and mindmaps
- **Smart Image Handling**: Complex diagrams (gantt, pie, etc.) are converted as images for best visual fidelity
- **Text Labels**: Text labels from supported diagrams are preserved and rendered correctly
- **Seamless Integration**: Works perfectly with the official Excalidraw plugin
- **Proper File Format**: Creates compressed `.excalidraw.md` files that are fully compatible
- **Easy to Use**: Simple command palette interface and ribbon icon for bulk operations

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

### Single Diagram Conversion

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

### Bulk Conversion (New!)

1.  Open a markdown file containing multiple Mermaid diagrams.
2.  Click the **workflow icon** (🔄) in the ribbon, or use the command "Convert All Mermaid Diagrams in File".
3.  The plugin will automatically find and convert all Mermaid code blocks in the file.
4.  Each diagram will be saved as a separate numbered file: `Filename-Diagram-1.excalidraw.md`, `Filename-Diagram-2.excalidraw.md`, etc.
5.  A summary notice will show how many diagrams were successfully converted.

## 📊 Supported Diagram Types

| Diagram Type             | Support       | Rendering Method  | Notes                                    |
| ------------------------ | ------------- | ----------------- | ---------------------------------------- |
| **Flowcharts**           | ✅ Full       | Individual shapes | Includes styling and labels              |
| **Sequence Diagrams**    | ⚠️ Basic      | Individual shapes | May not render optimally in some cases   |
| **Gantt Charts**         | ✅ Full       | Single image      | Perfect visual reproduction              |
| **State Diagrams**       | ✅ Full       | Single image      | Complete state transitions               |
| **ER Diagrams**          | ✅ Full       | Single image      | Database relationships preserved         |
| **Pie Charts**           | ✅ Full       | Single image      | Data visualization maintained            |
| **Journey Maps**         | ✅ Full       | Single image      | User experience flows                    |
| **Requirement Diagrams** | ✅ Full       | Single image      | System requirements                      |
| **Timelines**            | ✅ Full       | Single image      | Chronological events                     |
| **Mindmaps**             | ✅ Full       | Single image      | Hierarchical structures                  |
| **Class Diagrams**       | ⚠️ Basic      | Individual shapes | Renders skeleton, text currently missing |
| **Git Graphs**           | 🔄 Processing | Varies            | Attempting conversion, results may vary  |

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

This plugin is released under the MIT License. See the [LICENSE](LICENSE) file for details.
The core conversion library this plugin utilizes, `@excalidraw/mermaid-to-excalidraw`, is also licensed under the MIT License, Copyright (c) 2023 Excalidraw.
