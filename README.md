# Mermaid to Excalidraw Converter (Obsidian Plugin) 🧉

_Fueled by Yerba Mate and a love for diagrams!_

This plugin for Obsidian allows you to convert Mermaid.js diagram code blocks into Excalidraw drawings.

## Features

- Convert selected Mermaid code to an Excalidraw drawing.
- Creates a new `.excalidraw.md` file in your vault.

## Based on Excalidraw's Work

This plugin utilizes and is inspired by the core functionality of the [`@excalidraw/mermaid-to-excalidraw`](https://github.com/excalidraw/mermaid-to-excalidraw) library.
The original library is licensed under the MIT License, Copyright (c) 2023 Excalidraw.

## Installation

1.  **Build the plugin** (See Development section below if installing from source).
2.  **Copy Plugin Files:**
    - `main.js`
    - `manifest.json`
    - (Optional) `styles.css` if it exists.
3.  **Create Plugin Folder:** In your Obsidian vault, go to `.obsidian/plugins/` and create a new folder named `mermaid-to-excalidraw`.
4.  **Paste Files:** Paste `main.js` and `manifest.json` into this new folder.
5.  **Enable Plugin:**
    - Open Obsidian settings.
    - Go to "Community Plugins".
    - Turn off "Restricted mode" if it's on.
    - Find "Mermaid to Excalidraw Converter" in the list and enable it.

## How to Use

1.  Create or open a note in Obsidian.
2.  Write or paste your Mermaid diagram code (e.g., `graph TD; A-->B;`).
3.  Select the entire Mermaid code block.
4.  Open the Command Palette (default `Ctrl+P` or `Cmd+P`).
5.  Type "Convert Mermaid to Excalidraw" and select the command.
6.  A new file (e.g., `Converted-Mermaid-TIMESTAMP.excalidraw.md`) will be created in your vault with the Excalidraw version of your diagram.
    _(Note: Currently, the conversion creates a placeholder. Full diagram conversion is the next development step!)_

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
