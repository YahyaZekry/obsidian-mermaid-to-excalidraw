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

// Function to transform custom elements to proper Excalidraw format
function transformToExcalidrawElements(customElements: any[]): any[] {
  const excalidrawElements: any[] = [];

  for (const element of customElements) {
    // Add the shape element (without label)
    const shapeElement = {
      id: element.id,
      type: element.type,
      x: element.x,
      y: element.y,
      width: element.width || 0,
      height: element.height || 0,
      angle: 0,
      strokeColor: "#1e1e1e",
      backgroundColor: "transparent",
      fillStyle: "solid",
      strokeWidth: element.strokeWidth || 2,
      strokeStyle: "solid",
      roughness: 1,
      opacity: 100,
      groupIds: element.groupIds || [],
      frameId: null,
      roundness: element.roundness || null,
      seed: Math.floor(Math.random() * 1000000),
      versionNonce: Math.floor(Math.random() * 1000000),
      isDeleted: false,
      boundElements: null,
      updated: 1,
      link: element.link,
      locked: false,
    };

    // Handle arrow-specific properties
    if (element.type === "arrow") {
      (shapeElement as any).points = element.points || [
        [0, 0],
        [0, 0],
      ];
      (shapeElement as any).lastCommittedPoint = null;
      (shapeElement as any).startBinding = element.start
        ? { elementId: element.start.id, focus: 0, gap: 0 }
        : null;
      (shapeElement as any).endBinding = element.end
        ? { elementId: element.end.id, focus: 0, gap: 0 }
        : null;
      (shapeElement as any).startArrowhead = null;
      (shapeElement as any).endArrowhead = "arrow";
    }

    excalidrawElements.push(shapeElement);

    // If element has a label, create a separate text element
    if (element.label && element.label.text) {
      const textElement = {
        id: `${element.id}_text`,
        type: "text",
        x:
          element.x +
          (element.width || 0) / 2 -
          (element.label.text.length * (element.label.fontSize || 16)) / 4,
        y:
          element.y +
          (element.height || 0) / 2 -
          (element.label.fontSize || 16) / 2,
        width: element.label.text.length * (element.label.fontSize || 16) * 0.6,
        height: element.label.fontSize || 16,
        angle: 0,
        strokeColor: "#1e1e1e",
        backgroundColor: "transparent",
        fillStyle: "solid",
        strokeWidth: 2,
        strokeStyle: "solid",
        roughness: 1,
        opacity: 100,
        groupIds: element.label.groupIds || [],
        frameId: null,
        roundness: null,
        seed: Math.floor(Math.random() * 1000000),
        versionNonce: Math.floor(Math.random() * 1000000),
        isDeleted: false,
        boundElements: null,
        updated: 1,
        link: null,
        locked: false,
        text: element.label.text,
        fontSize: element.label.fontSize || 16,
        fontFamily: 1,
        textAlign: "center",
        verticalAlign: "middle",
        baseline: 13,
        containerId: element.id,
        originalText: element.label.text,
        lineHeight: 1.25,
      };

      excalidrawElements.push(textElement);
    }
  }

  return excalidrawElements;
}

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

      // Transform custom elements to proper Excalidraw format
      const transformedElements = transformToExcalidrawElements(elements || []);
      console.log(
        "Obsidian Mermaid to Excalidraw: Transformed elements:",
        JSON.stringify(transformedElements, null, 2)
      );

      const excalidrawData = {
        type: "excalidraw",
        version: 2,
        source: "obsidian-mermaid-to-excalidraw",
        elements: transformedElements, // Use transformed elements
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
