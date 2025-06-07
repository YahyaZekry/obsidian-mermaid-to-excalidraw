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
// import mermaid from 'mermaid'; // Potentially unused if core-lib handles it
import { parseMermaidToExcalidraw } from "./core-lib"; // Assuming index.ts in core-lib exports this

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
    try {
      // Use the actual parseMermaidToExcalidraw function
      const { elements, files } = await parseMermaidToExcalidraw(mermaidCode, {
        // Default config or allow customization via settings later
        // For now, let's use an empty config object or rely on library defaults
      });

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
      // Ensure the excalidraw JSON block is correctly formatted for Obsidian
      const fileContent = `---\ntype: excalidraw\n---\n\n\`\`\`json\n${JSON.stringify(
        excalidrawData,
        null,
        2
      )}\n\`\`\``;
      await this.app.vault.create(fileName, fileContent);
      new Notice(`Converted to ${fileName}`);
    } catch (error) {
      new Notice(`Error converting diagram: ${error.message}`);
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
