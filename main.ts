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
import { nanoid } from "nanoid"; // Import nanoid
// import mermaid from 'mermaid'; // Potentially unused if core-lib handles it
import { parseMermaidToExcalidraw } from "./core-lib"; // Assuming index.ts in core-lib exports this

// Function to transform custom elements to proper Excalidraw format
function transformToExcalidrawElements(customElements: any[]): any[] {
  const excalidrawElements: any[] = [];

  for (const element of customElements) {
    console.log("DEBUG: Processing element:", element);

    // Handle image elements (for gantt, pie, etc. that render as images)
    if (element.type === "image") {
      console.log(
        `DEBUG: Image element found. Original fileId: ${element.fileId}. Original element.id: ${element.id}`,
        element
      );
      const imageElement = {
        id: element.id || nanoid(), // Ensure an ID exists, generate if undefined
        type: "image",
        x: element.x || 0,
        y: element.y || 0,
        width: element.width || 400,
        height: element.height || 300,
        angle: 0,
        strokeColor: "transparent",
        backgroundColor: "transparent",
        fillStyle: "solid",
        strokeWidth: 0,
        strokeStyle: "solid",
        roughness: 0,
        opacity: 100,
        groupIds: [],
        frameId: null,
        roundness: null,
        seed: Math.floor(Math.random() * 1000000),
        versionNonce: Math.floor(Math.random() * 1000000),
        isDeleted: false,
        boundElements: null,
        updated: 1,
        link: null,
        locked: false,
        fileId: element.fileId, // Critical for image elements
        scale: [1, 1],
      };
      console.log("DEBUG: Created Excalidraw image element:", imageElement);
      excalidrawElements.push(imageElement);
      continue;
    }

    // Handle regular shape elements
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

    // Add ribbon icon for bulk conversion
    this.addRibbonIcon(
      "workflow",
      "Convert All Mermaid Diagrams in File",
      () => {
        this.bulkConvertMermaidDiagrams();
      }
    );

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

      // Transform custom elements to proper Excalidraw format
      const transformedElements = transformToExcalidrawElements(elements || []);
      // console.log(
      //   "Obsidian Mermaid to Excalidraw: Transformed elements:",
      //   JSON.stringify(transformedElements, null, 2)
      // );

      const excalidrawData = {
        type: "excalidraw",
        version: 2,
        source: "obsidian-mermaid-to-excalidraw",
        elements: transformedElements,
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
      // console.log(
      //   "Obsidian Mermaid to Excalidraw: Attempting to create file:",
      //   fileName
      // ); // DEBUG
      // console.log("Obsidian Mermaid to Excalidraw: File content preview (first 200 chars):", fileContent.substring(0, 200)); // DEBUG
      await this.app.vault.create(fileName, fileContent);
      new Notice(`Converted to ${fileName}`);
    } catch (error) {
      new Notice(`Error converting diagram: ${(error as Error).message}`);
      console.error(error);
    }
  }

  async bulkConvertMermaidDiagrams() {
    // Get active file and editor
    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!activeView) {
      new Notice("No active markdown file found");
      return;
    }

    // Get file content
    const fileContent = activeView.editor.getValue();
    console.log("DEBUG: Full file content:", fileContent);

    // Find all Mermaid blocks
    const mermaidBlocks = this.extractMermaidBlocks(fileContent);
    console.log("DEBUG: Found mermaid blocks:", mermaidBlocks);

    if (mermaidBlocks.length === 0) {
      new Notice("No Mermaid diagrams found in this file");
      return;
    }

    // Convert each block
    let successful = 0;
    let failed = 0;
    let skipped = 0;
    const baseFileName = activeView.file?.basename || "Unknown";

    for (let i = 0; i < mermaidBlocks.length; i++) {
      try {
        const diagramCode = mermaidBlocks[i];
        console.log(`DEBUG: Converting diagram ${i + 1}:`, diagramCode);

        // Check for unsupported diagram types
        const diagramType = this.getDiagramType(diagramCode);
        if (this.isUnsupportedDiagramType(diagramType)) {
          console.log(
            `DEBUG: Skipping unsupported diagram type: ${diagramType}`
          );
          new Notice(
            `Skipped diagram ${
              i + 1
            }: ${diagramType} not yet supported by conversion library`
          );
          skipped++;
          continue;
        }

        // Preprocess the diagram code to fix known issues
        const processedCode = this.preprocessDiagramCode(diagramCode);
        console.log(`DEBUG: Processed diagram ${i + 1}:`, processedCode);

        // Use the same conversion logic as the working command
        const config = {
          themeVariables: {
            fontSize: "16px",
          },
        };

        const { elements, files } = await parseMermaidToExcalidraw(
          processedCode,
          config
        );

        console.log(`DEBUG: Diagram ${i + 1} - Raw elements:`, elements);
        console.log(`DEBUG: Diagram ${i + 1} - Raw files:`, files);

        // Transform custom elements to proper Excalidraw format
        const transformedElements = transformToExcalidrawElements(
          elements || []
        );
        console.log(
          `DEBUG: Diagram ${i + 1} - Transformed elements:`,
          transformedElements
        );

        console.log(
          `DEBUG: Diagram ${i + 1} - Final files object for Excalidraw:`,
          files
        ); // Log the files object

        const excalidrawData = {
          type: "excalidraw",
          version: 2,
          source: "obsidian-mermaid-to-excalidraw",
          elements: transformedElements,
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

        const fileName = `${baseFileName}-Diagram-${i + 1}.excalidraw.md`;
        const jsonString = JSON.stringify(excalidrawData, null, 2);
        const base64EncodedData = LZString.compressToBase64(jsonString);

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

        await this.app.vault.create(fileName, fileContent);
        console.log(`DEBUG: Successfully created file: ${fileName}`);
        successful++;
        // Add a 1-second delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log(`DEBUG: Waited 1 second after diagram ${i + 1}`);
      } catch (error) {
        console.error(`ERROR: Failed to convert diagram ${i + 1}:`, error);
        failed++;
      }
    }

    // Show summary
    new Notice(
      `Converted ${successful} diagrams${
        failed > 0 ? `, ${failed} failed` : ""
      }${skipped > 0 ? `, ${skipped} skipped (unsupported)` : ""}`
    );
  }

  getDiagramType(diagramCode: string): string {
    const firstLine = diagramCode.trim().split("\n")[0].toLowerCase();
    if (firstLine.startsWith("flowchart")) return "flowchart";
    if (firstLine.startsWith("sequencediagram")) return "sequence";
    if (firstLine.startsWith("gantt")) return "gantt";
    if (firstLine.startsWith("classdiagram")) return "class";
    if (firstLine.startsWith("statediagram")) return "state";
    if (firstLine.startsWith("erdiagram")) return "er";
    if (firstLine.startsWith("gitgraph")) return "gitgraph";
    if (firstLine.startsWith("pie")) return "pie";
    if (firstLine.startsWith("journey")) return "journey";
    if (firstLine.startsWith("requirementdiagram")) return "requirement";
    if (firstLine.startsWith("timeline")) return "timeline";
    if (firstLine.startsWith("mindmap")) return "mindmap";
    return "unknown";
  }

  isUnsupportedDiagramType(diagramType: string): boolean {
    // List of diagram types that are known to have issues with the conversion library
    const unsupportedTypes = [
      "gitgraph", // gitgraph is not recognized by the library
      "class", // class diagrams have lexical parsing issues with relationship syntax
      "sequence", // Sequence diagrams are complex and current core-lib output is insufficient
    ];
    return unsupportedTypes.includes(diagramType);
  }

  preprocessDiagramCode(diagramCode: string): string {
    // Fix known syntax issues
    let processedCode = diagramCode;

    // Fix class diagram relationship syntax issues
    if (diagramCode.toLowerCase().includes("classdiagram")) {
      // The error is on line 35 with "User ||--o{ Order : place" - missing 's' in 'places'
      // Looking at the error, it seems to be a truncation issue in the error message
      // Let's fix the relationship lines more comprehensively

      // Fix spacing around relationship operators
      processedCode = processedCode.replace(/\s*\|\|--o\{\s*/g, " ||--o{ ");
      processedCode = processedCode.replace(/\s*\}o--o\{\s*/g, " }o--o{ ");

      // Add proper spacing around colons in relationships
      processedCode = processedCode.replace(/\s*:\s*/g, " : ");

      // Ensure proper line endings
      processedCode = processedCode.replace(/\r\n/g, "\n");

      console.log("DEBUG: Applied comprehensive class diagram fixes");
    }

    return processedCode;
  }

  extractMermaidBlocks(content: string): string[] {
    // Regex to match ```mermaid...``` blocks
    const mermaidRegex = /```mermaid([\s\S]*?)```/g;
    const blocks: string[] = [];
    let match;

    console.log("DEBUG: Starting regex search for mermaid blocks");

    while ((match = mermaidRegex.exec(content)) !== null) {
      const diagramContent = match[1].trim();
      console.log("DEBUG: Found mermaid block:", diagramContent);
      if (diagramContent) {
        blocks.push(diagramContent);
      }
    }

    console.log("DEBUG: Total blocks found:", blocks.length);
    return blocks;
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
