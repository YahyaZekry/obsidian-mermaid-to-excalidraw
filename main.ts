import {
  App,
  Editor,
  MarkdownView,
  MarkdownFileInfo, // Attempting to import this type
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
} from "obsidian";
import pako from "pako";
// import mermaid from 'mermaid'; // Potentially unused if core-lib handles it
import { parseMermaidToExcalidraw } from "./core-lib"; // Assuming index.ts in core-lib exports this

// Helper function to convert Uint8Array to base64
function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export default class MermaidToExcalidrawPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: "convert-mermaid-to-excalidraw",
      name: "Convert Mermaid to Excalidraw",
      editorCallback: (
        editor: Editor,
        ctx: MarkdownView | MarkdownFileInfo
      ) => {
        if (ctx instanceof MarkdownView) {
          this.convertMermaidToExcalidraw(editor, ctx);
        } else {
          // Handle cases where ctx might be MarkdownFileInfo if necessary,
          // or if the command shouldn't run, show a notice.
          // For an editor command, it's usually expected to be MarkdownView.
          new Notice(
            "This command can only be run in an active Markdown editor view."
          );
        }
      },
    });
    this.addSettingTab(new MermaidToExcalidrawSettingTab(this.app, this));
  }

  async convertMermaidToExcalidraw(editor: Editor, view: MarkdownView) {
    const selectedText = editor.getSelection();
    let mermaidCode = selectedText;
    if (!mermaidCode) {
      new Notice("Please select a Mermaid code block.");
      return;
    }
    // console.log(
    //   "Obsidian Mermaid to Excalidraw: Selected Mermaid code:",
    //   mermaidCode
    // );
    try {
      // Use the actual parseMermaidToExcalidraw function
      const config = {
        themeVariables: {
          fontSize: "16px", // Provide a default font size
        },
        // You might explore other default configs from the library if needed
      };
      // console.log(
      //   "Obsidian Mermaid to Excalidraw: Calling parseMermaidToExcalidraw with config:",
      //   config
      // );
      const { elements, files } = await parseMermaidToExcalidraw(
        mermaidCode,
        config
      );

      // console.log(
      //   "Obsidian Mermaid to Excalidraw: Conversion result - elements:",
      //   JSON.stringify(elements, null, 2)
      // );
      // console.log(
      //   "Obsidian Mermaid to Excalidraw: Conversion result - files:",
      //   JSON.stringify(files, null, 2)
      // );

      const excalidrawData = {
        type: "excalidraw",
        version: 2,
        source: "obsidian-mermaid-to-excalidraw",
        elements: elements || [], // Ensure elements is an array
        files: files || {}, // Ensure files is an object
        appState: {
          viewBackgroundColor: "#ffffff",
          gridSize: null,
          // Potentially add other appState defaults if needed by the elements
        },
      };

      const fileName = `Converted-Mermaid-${Date.now()}.excalidraw.md`;

      const jsonString = JSON.stringify(excalidrawData, null, 2);
      const compressedData = pako.deflate(jsonString);
      const base64EncodedData = uint8ArrayToBase64(compressedData);

      // New structure with actual compression and updated frontmatter
      const fileContent = `---
excalidraw-plugin: parsed
tags: [excalidraw]
---

## Drawing
\`\`\`compressed-json
${base64EncodedData}
\`\`\`
%%`;
      await this.app.vault.create(fileName, fileContent);
      new Notice(`Converted to ${fileName}`);
    } catch (error) {
      new Notice(`Error converting diagram: ${(error as Error).message}`);
      console.error(error);
    }
  }
}

class MermaidToExcalidrawSettingTab extends PluginSettingTab {
  plugin: MermaidToExcalidrawPlugin;
  constructor(app: App, plugin: MermaidToExcalidrawPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Mermaid to Excalidraw Settings" });
    // Add settings here if needed
  }
}
