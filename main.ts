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
import LZString from "lz-string";
// import mermaid from 'mermaid'; // Potentially unused if core-lib handles it
import { parseMermaidToExcalidraw } from "./core-lib"; // Assuming index.ts in core-lib exports this

export default class MermaidToExcalidrawPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: "convert-mermaid-to-excalidraw-new-file", // Changed ID for uniqueness
      name: "Convert Mermaid to New Excalidraw File (MtoE)", // Changed name for uniqueness
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

      console.log(
        "Obsidian Mermaid to Excalidraw: Conversion result - elements:",
        JSON.stringify(elements, null, 2)
      );
      console.log(
        "Obsidian Mermaid to Excalidraw: Conversion result - files:",
        JSON.stringify(files, null, 2)
      );

      const excalidrawData = {
        type: "excalidraw",
        version: 2,
        source: "obsidian-mermaid-to-excalidraw",
        elements: elements || [], // Ensure elements is an array
        files: files || {}, // Ensure files is an object
        appState: {
          viewBackgroundColor: "#ffffff",
          currentItemStrokeColor: "#1e1e1e",
          currentItemBackgroundColor: "transparent",
          currentItemFillStyle: "solid",
          currentItemStrokeWidth: 2,
          currentItemStrokeStyle: "solid",
          currentItemRoughness: 1,
          currentItemOpacity: 100,
          currentItemFontFamily: 1,
          currentItemFontSize: 20,
          currentItemTextAlign: "left",
          currentItemStartArrowhead: null,
          currentItemEndArrowhead: "arrow",
          scrollX: 0,
          scrollY: 0,
          zoom: {
            value: 1,
          },
          currentItemRoundness: "round",
          gridSize: null,
          gridColor: {
            Bold: "#C9C9C9FF",
            Regular: "#EDEDEDFF",
          },
          currentStrokeOptions: null,
          previousGridSize: null,
          frameRendering: {
            enabled: true,
            clip: true,
            name: true,
            outline: true,
          },
        },
      };

      const fileName = `Converted-Mermaid-${Date.now()}.excalidraw.md`;

      const jsonString = JSON.stringify(excalidrawData, null, 2);
      // Use LZString for compression to match Excalidraw's typical format
      const base64EncodedData = LZString.compressToBase64(jsonString);

      // New structure with actual compression and official Excalidraw plugin frontmatter
      const fileContent = `---
excalidraw-plugin: parsed
tags: [excalidraw]
---

==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠==

## Drawing
\`\`\`compressed-json
${base64EncodedData}
\`\`\`
%%`;
      console.log(
        "Obsidian Mermaid to Excalidraw: Attempting to create file:",
        fileName
      ); // DEBUG
      // console.log("Obsidian Mermaid to Excalidraw: File content preview (first 200 chars):", fileContent.substring(0, 200)); // DEBUG
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
