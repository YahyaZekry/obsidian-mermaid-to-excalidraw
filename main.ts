import {
  App,
  Editor,
  MarkdownView,
  MarkdownFileInfo, // Attempting to import this type
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  normalizePath,
  TFile, // Added TFile
} from "obsidian";
import LZString from "lz-string";
import { nanoid } from "nanoid"; // Import nanoid
// import mermaid from 'mermaid'; // Potentially unused if core-lib handles it
import { parseMermaidToExcalidraw } from "./core-lib"; // Assuming index.ts in core-lib exports this

// Function to transform custom elements to proper Excalidraw format
function transformToExcalidrawElements(customElements: any[]): any[] {
  const excalidrawElements: any[] = [];

  for (const element of customElements) {
    // console.log("DEBUG: Processing element:", element); // Removed DEBUG log

    // Handle image elements (for gantt, pie, etc. that render as images)
    if (element.type === "image") {
      // console.log(
      //   `DEBUG: Image element found. Original fileId: ${element.fileId}. Original element.id: ${element.id}`,
      //   element
      // ); // Removed DEBUG log
      const newElementId = element.id || nanoid(); // ID for the Excalidraw element itself
      const newFileId = nanoid(); // New FileId for Excalidraw's internal file referencing

      const imageElement: any = {
        // Add 'any' to allow temporary property
        id: newElementId,
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
        boundElements: [], // Changed from null to empty array
        updated: 1,
        link: null,
        locked: false,
        fileId: newFileId, // Use the new nanoid for Excalidraw element's fileId
        scale: [1, 1],
        originalFileId: element.fileId, // Store original to re-map files object later
      };
      // console.log(
      //   "DEBUG: Created Excalidraw image element (pre-file-remapping):",
      //   imageElement
      // ); // Removed DEBUG log
      excalidrawElements.push(imageElement);
      continue;
    }

    // Handle regular shape elements
    let shapeElement: any = {
      // Use 'any' for flexibility with type-specific properties
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
      boundElements: [], // Changed from null to empty array
      updated: 1,
      link: element.link,
      locked: false,
    };

    // Handle arrow-specific properties
    if (element.type === "arrow") {
      shapeElement.points = element.points || [
        [0, 0],
        [0, 0],
      ];
      shapeElement.lastCommittedPoint = null;
      shapeElement.startBinding = element.start
        ? { elementId: element.start.id, focus: 0, gap: 0 }
        : null;
      shapeElement.endBinding = element.end
        ? { elementId: element.end.id, focus: 0, gap: 0 }
        : null;
      shapeElement.startArrowhead = element.startArrowhead || null; // Ensure default if not specified
      shapeElement.endArrowhead = element.endArrowhead || "arrow"; // Default to arrow if not specified
    } else if (element.type === "line") {
      // Ensure 'points' property for line elements
      shapeElement.points = element.points || [
        [0, 0],
        [0, 0],
      ];
      // Ensure arrowheads are null for basic lines if not specified
      shapeElement.startArrowhead = element.startArrowhead || null;
      shapeElement.endArrowhead = element.endArrowhead || null;
    } else if (element.type === "frame") {
      // Ensure 'children' property for frame elements
      shapeElement.name = element.name || ""; // Frames have names
      shapeElement.children = element.children || []; // Ensure children is an array
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
        boundElements: [], // Changed from null to empty array
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
  settings!: MermaidToExcalidrawSettings;

  async onload() {
    await this.loadSettings();
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

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
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
    // ); // Kept this commented out log as it's not a "DEBUG:" one
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
      // ); // Kept this commented out log
      const { elements, files } = await parseMermaidToExcalidraw(
        mermaidCode,
        config
      );

      // console.log(
      //   "Obsidian Mermaid to Excalidraw: Conversion result - elements:",
      //   JSON.stringify(elements, null, 2)
      // ); // Kept this commented out log
      // console.log(
      //   "Obsidian Mermaid to Excalidraw: Conversion result - files:",
      //   JSON.stringify(files, null, 2)
      // ); // Kept this commented out log

      // Transform custom elements to proper Excalidraw format
      const transformedElements = transformToExcalidrawElements(elements || []);
      // console.log(
      //   "Obsidian Mermaid to Excalidraw: Transformed elements:",
      //   JSON.stringify(transformedElements, null, 2)
      // ); // Kept this commented out log

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

      let fileName = `Converted-Mermaid-${Date.now()}.excalidraw.md`;
      let filePath = fileName;

      // If setting enabled, output to folder named after source file
      if (this.settings.outputToNamedFolder && view.file) {
        const baseName = view.file.basename;
        const folderPath = baseName; // folderPath is just the basename, will be created in current dir
        fileName = `Converted-Mermaid-${Date.now()}.excalidraw.md`;
        // Ensure the folder path is normalized, though for a simple basename it might not change much
        const normalizedFolderPath = normalizePath(folderPath);
        filePath = normalizePath(`${normalizedFolderPath}/${fileName}`);
        // Create folder if it doesn't exist
        if (!(await this.app.vault.adapter.exists(normalizedFolderPath))) {
          await this.app.vault.createFolder(normalizedFolderPath);
        }
      } else {
        // Ensure filePath is normalized even if not in a subfolder
        filePath = normalizePath(fileName);
      }

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
      const newFile = await this.app.vault.create(filePath, fileContent);
      new Notice(`Converted to ${filePath}`);

      // Explicitly open the new file in a new leaf
      if (newFile instanceof TFile) {
        const newLeaf = this.app.workspace.getLeaf("tab");
        await newLeaf.openFile(newFile);
        // Ensure the new leaf is focused.
        this.app.workspace.setActiveLeaf(newLeaf, { focus: true });
      }
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
    // console.log("DEBUG: Full file content:", fileContent); // Removed DEBUG log

    // Find all Mermaid blocks
    const mermaidBlocks = this.extractMermaidBlocks(fileContent);
    // console.log("DEBUG: Found mermaid blocks:", mermaidBlocks); // Removed DEBUG log

    if (mermaidBlocks.length === 0) {
      new Notice("No Mermaid diagrams found in this file");
      return;
    }

    // Convert each block
    let successful = 0;
    let failed = 0;
    let skipped = 0;
    let createdDiagramCount = 0; // Counter for successfully created diagrams - RESET HERE
    const baseFileName = activeView.file?.basename || "Unknown";

    // Reset counter at the beginning of each bulk conversion
    createdDiagramCount = 0;

    for (let i = 0; i < mermaidBlocks.length; i++) {
      try {
        const diagramCode = mermaidBlocks[i];
        // Use (i + 1) for logging to match user's expectation of 1-based indexing for source blocks
        // console.log(
        //   `DEBUG: Processing source diagram block ${i + 1}:`,
        //   diagramCode
        // ); // Removed DEBUG log

        // Check for unsupported diagram types
        const diagramType = this.getDiagramType(diagramCode);
        if (this.isUnsupportedDiagramType(diagramType)) {
          // console.log(
          //   `DEBUG: Skipping unsupported diagram type: ${diagramType}`
          // ); // Removed DEBUG log
          new Notice(
            `Skipped diagram ${
              // Log with source block index
              i + 1
            }: ${diagramType} not yet supported by conversion library`
          );
          skipped++;
          continue;
        }

        // Preprocess the diagram code to fix known issues
        const processedCode = this.preprocessDiagramCode(diagramCode);
        // console.log(
        //   `DEBUG: Processed diagram (source block ${i + 1}):`,
        //   processedCode
        // ); // Removed DEBUG log

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

        // Special handling for sequence diagrams - treat as image if multiple elements but no files
        if (
          diagramType === "sequence" &&
          elements &&
          elements.length > 5 &&
          !files
        ) {
          // console.log(
          //   `DEBUG: Sequence diagram (source block ${i + 1}) has ${
          //     elements.length
          //   } elements but no files - this suggests individual shapes rather than a single image. This may not render well.`
          // ); // Removed DEBUG log
          // For now, we'll continue with the transformation, but this identifies the issue
        }

        // Detailed logging for sequence diagrams
        // if (diagramType === "sequence") {
        //   console.log(
        //     `DEBUG: Diagram (source block ${
        //       i + 1
        //     }, Sequence) - Raw elements from core-lib:`,
        //     elements?.length || 0,
        //     "elements"
        //   );
        // } else {
        //   console.log(
        //     `DEBUG: Diagram (source block ${i + 1}) - Raw elements:`,
        //     elements?.length || 0,
        //     "elements"
        //   );
        // } // Removed DEBUG log
        // console.log(
        //   `DEBUG: Diagram (source block ${i + 1}) - Raw files:`,
        //   files ? Object.keys(files).length : 0,
        //   "files"
        // ); // Removed DEBUG log

        // Transform custom elements to proper Excalidraw format
        const transformedElements = transformToExcalidrawElements(
          elements || []
        );
        // console.log(
        //   `DEBUG: Diagram (source block ${i + 1}) - Transformed elements:`,
        //   transformedElements
        // ); // Removed DEBUG log

        // console.log(
        //   `DEBUG: Diagram (source block ${
        //     i + 1
        //   }) - Final files object for Excalidraw:`,
        //   files
        // ); // Removed DEBUG log

        // Re-map the files object to use the new fileIds generated for image elements
        const finalFiles: Record<string, any> = {};
        if (files) {
          for (const el of transformedElements) {
            if (
              el.type === "image" &&
              el.originalFileId &&
              files[el.originalFileId]
            ) {
              const newFileId = el.fileId; // This is the nanoid we generated
              finalFiles[newFileId] = {
                ...files[el.originalFileId],
                id: newFileId, // Ensure the id inside the file data also matches
              };
              delete el.originalFileId; // Clean up temporary property
            }
          }
        }
        console.log(
          `DEBUG: Diagram (source block ${
            i + 1
          }) - Remapped files object for Excalidraw:`,
          finalFiles
        );

        const excalidrawData = {
          type: "excalidraw",
          version: 2,
          source: "obsidian-mermaid-to-excalidraw",
          elements: transformedElements,
          files: finalFiles, // Use the re-mapped files object
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

        createdDiagramCount++; // Increment counter for successfully processed diagrams
        let fileName = `${baseFileName}-Diagram-${createdDiagramCount}.excalidraw.md`;
        let filePath = fileName;

        // If setting enabled, output to folder named after source file
        if (this.settings.outputToNamedFolder && activeView.file) {
          const folderPath = baseFileName; // folderPath is just the basename
          // Ensure the folder path is normalized
          const normalizedFolderPath = normalizePath(folderPath);
          filePath = normalizePath(`${normalizedFolderPath}/${fileName}`);
          // Create folder if it doesn't exist
          if (!(await this.app.vault.adapter.exists(normalizedFolderPath))) {
            await this.app.vault.createFolder(normalizedFolderPath);
          }
        } else {
          // Ensure filePath is normalized even if not in a subfolder
          filePath = normalizePath(fileName);
        }

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

        await this.app.vault.create(filePath, fileContent);
        // console.log(
        //   `DEBUG: Successfully created file: ${filePath} (from source block ${
        //     i + 1
        //   })`
        // ); // Removed DEBUG log
        successful++;
        // Add a 1-second delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // console.log(
        //   `DEBUG: Waited 1 second after diagram (source block ${i + 1})`
        // ); // Removed DEBUG log
      } catch (error) {
        console.error(
          `ERROR: Failed to convert diagram (source block ${i + 1}):`,
          error
        );
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
    const unsupportedTypes: string[] = [
      // "gitgraph", // gitgraph is not recognized by the library - Re-enabling for testing
      // Removed "class" - will attempt to process class diagrams
      // Removed "sequence" - will process as images if core-lib provides them
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

      // console.log("DEBUG: Applied comprehensive class diagram fixes"); // Removed DEBUG log
    }

    return processedCode;
  }

  extractMermaidBlocks(content: string): string[] {
    // Regex to match ```mermaid...``` blocks
    const mermaidRegex = /```mermaid([\s\S]*?)```/g;
    const blocks: string[] = [];
    let match;

    // console.log("DEBUG: Starting regex search for mermaid blocks"); // Removed DEBUG log

    while ((match = mermaidRegex.exec(content)) !== null) {
      const diagramContent = match[1].trim();
      // console.log("DEBUG: Found mermaid block:", diagramContent); // Removed DEBUG log
      if (diagramContent) {
        blocks.push(diagramContent);
      }
    }

    // console.log("DEBUG: Total blocks found:", blocks.length); // Removed DEBUG log
    return blocks;
  }
}

interface MermaidToExcalidrawSettings {
  outputToNamedFolder: boolean;
}

const DEFAULT_SETTINGS: MermaidToExcalidrawSettings = {
  outputToNamedFolder: false,
};

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

    new Setting(containerEl)
      .setName("Output to folder named after source file")
      .setDesc(
        "If enabled, converted files will be placed in a folder named after the source markdown file (without extension)."
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.outputToNamedFolder)
          .onChange(async (value) => {
            this.plugin.settings.outputToNamedFolder = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
