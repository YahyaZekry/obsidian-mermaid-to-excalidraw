import { App, Editor, MarkdownView, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import mermaid from 'mermaid';

export default class MermaidToExcalidrawPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: 'convert-mermaid-to-excalidraw',
      name: 'Convert Mermaid to Excalidraw',
      editorCallback: (editor: Editor, view: MarkdownView) => {
        this.convertMermaidToExcalidraw(editor, view);
      }
    });
    this.addSettingTab(new MermaidToExcalidrawSettingTab(this.app, this));
  }

  async convertMermaidToExcalidraw(editor: Editor, view: MarkdownView) {
    const selectedText = editor.getSelection();
    let mermaidCode = selectedText;
    if (!mermaidCode) {
      new Notice('Please select a Mermaid code block.');
      return;
    }
    try {
      // Render Mermaid to SVG
      const { svg } = await mermaid.render('mermaid-svg', mermaidCode);
      // For a real plugin, parse the SVG and map to Excalidraw JSON here
      // For now, just create a placeholder Excalidraw file
      const excalidrawData = {
        type: 'excalidraw',
        version: 2,
        source: 'obsidian-mermaid-to-excalidraw',
        elements: [
          {
            type: 'text',
            version: 1,
            versionNonce: 1,
            isDeleted: false,
            id: 'placeholder',
            fillStyle: 'solid',
            strokeWidth: 1,
            strokeStyle: 'solid',
            roughness: 1,
            opacity: 100,
            angle: 0,
            x: 100,
            y: 100,
            strokeColor: '#000000',
            backgroundColor: 'transparent',
            width: 200,
            height: 25,
            seed: 123,
            groupIds: [],
            text: 'Converted from Mermaid',
            fontSize: 20,
            fontFamily: 1,
            textAlign: 'left',
            verticalAlign: 'top'
          }
        ],
        appState: {
          viewBackgroundColor: '#ffffff',
          gridSize: null
        }
      };
      const fileName = `Converted-Mermaid-${Date.now()}.excalidraw.md`;
      await this.app.vault.create(fileName, `---\ntype: exalidraw\n---\n\n\`\`\`excalidraw\n${JSON.stringify(excalidrawData, null, 2)}\n\`\`\``);
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
    containerEl.createEl('h2', { text: 'Mermaid to Excalidraw Settings' });
    // Add settings here if needed
  }
}
