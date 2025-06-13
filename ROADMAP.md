# Mermaid to Excalidraw Plugin Roadmap: Analysis and Strategic Recommendations

The roadmap presented outlines an ambitious and well-structured approach to enhancing the Mermaid to Excalidraw plugin capabilities. Based on current developments in the ecosystem and technical constraints, this analysis provides comprehensive recommendations for optimizing the implementation strategy and updating the roadmap to reflect the latest technical landscape and new feature requests.

---

## Current Ecosystem Assessment

The Mermaid to Excalidraw conversion landscape has evolved significantly since the roadmap's initial conception. The official `@excalidraw/mermaid-to-excalidraw` package currently supports only flowcharts for individual shape rendering, with other diagram types falling back to image rendering. This limitation stems from the complexity of parsing different Mermaid diagram structures and converting them to Excalidraw's element format. The parsing process involves two critical steps: rendering Mermaid diagrams to SVG for positional information and parsing the Mermaid syntax to understand element connections and relationships.

Recent developments in the Mermaid ecosystem present both opportunities and challenges for the roadmap. Mermaid has introduced 30 new flowchart shapes, significantly expanding visual representation capabilities. However, the core challenge remains in accessing Mermaid's Abstract Syntax Tree (AST) for different diagram types. The community has long requested better AST access, with discussions dating back to 2021. While the core `mermaid.parse()` API is primarily for validation, the newer `@mermaid-js/parser` package (Langium-based) shows promise in providing a more structured `DiagramAST`.

---

## Technical Implementation Recommendations

### Priority Reordering and Feasibility Assessment

The roadmap should prioritize diagram types based on both user demand and technical feasibility. **State diagrams** represent the most viable next target for individual shape rendering due to their relatively simple structure consisting of states (nodes) and transitions (edges). State diagrams have clear semantic boundaries and well-defined relationships that translate naturally to Excalidraw elements. The syntax includes basic states, transitions, composite states, and special markers for start and end states, all of which can be mapped to corresponding Excalidraw shapes.

**Mindmap diagrams**, while highly requested, present greater technical challenges due to their hierarchical nature and automatic layout algorithms. The Mermaid mindmap syntax relies heavily on indentation-based hierarchy, which requires sophisticated parsing to maintain spatial relationships when converting to individual Excalidraw elements. However, the growing demand for mindmap functionality, evidenced by community discussions and feature requests, suggests this should remain a high-priority item despite implementation complexity.

### Enhanced Parser Strategy

The roadmap should incorporate a multi-layered parsing approach.

- **Primary AST Source**: Leverage the `@mermaid-js/parser` package, which aims to provide a typed `DiagramAST`. Investigate its capabilities for State and Mindmap diagrams.
  ```typescript
  // Conceptual usage of @mermaid-js/parser
  // import { parse } from '@mermaid-js/parser'; // Hypothetical import
  // const text = 'graph TD; A-->B;';
  // const ast: DiagramAST = parse('flowchart', text);
  // console.log(ast.getNodes()); // Access structured data
  ```
- **JISON-based Parsers**: For diagram types like flowcharts where JISON parsers are used internally by Mermaid, explore direct access to their structured output (e.g., `getVertices()`, `getEdges()`).
- **Hybrid Approaches**: For more complex diagrams, combine AST data with SVG analysis to capture layout and positioning information accurately if direct AST parsing is insufficient.
- **AI-Assisted Generation**: The previous suggestion to explore AI models for interpreting Mermaid syntax remains a valid long-term research item, especially for diagram types with limited direct parsing support.

---

## Updated Roadmap Structure

### Phase 1: State Diagram Implementation (High Priority)

State diagrams should be elevated to the highest priority position due to their favorable complexity-to-value ratio. The implementation should focus on basic state representation using Excalidraw rectangles and ellipses, with transitions represented as labeled arrows. Special attention should be given to composite states, which can be represented using Excalidraw's grouping functionality to maintain hierarchical relationships.

The state diagram parser should handle all standard Mermaid state diagram features including start and end states marked with `[*]`, conditional paths using choice points, and concurrent states represented through parallel composition. The implementation should also support notes and styling options to maintain visual fidelity with the original Mermaid output. Accessing AST via `@mermaid-js/parser` will be key here.

### Phase 2: Enhanced Flowchart Support

Before expanding to entirely new diagram types, the roadmap should include improvements to existing flowchart support. Mermaid's recent introduction of 30 new flowchart shapes requires corresponding updates to the conversion logic. The new shapes use simplified syntax structures that may require parser modifications to handle properly. This phase should also address any existing limitations in flowchart conversion, such as subgraph handling or complex arrow routing.

### Phase 3: Mindmap Implementation (Medium-High Priority)

Mindmap implementation should proceed with a phased approach focusing initially on basic hierarchical structures before adding advanced features. The parser (ideally `@mermaid-js/parser`) should extract the root node and branch relationships from Mermaid's indentation-based syntax. Initial implementation can use simple rectangular nodes with connecting lines, with future iterations adding more sophisticated node shapes and automatic layout improvements.

The mindmap implementation faces unique challenges in preserving the automatic layout characteristics that make Mermaid mindmaps visually appealing. The conversion process should attempt to maintain relative positioning and hierarchical spacing while allowing users to modify individual elements in Excalidraw.

---

## IV. Technical Infrastructure Improvements

### Enhanced AST Access Strategy (Revised)

The roadmap must prioritize robust AST access.

1.  **Primary Focus on `@mermaid-js/parser`**: This Langium-based parser is the most promising avenue for obtaining a usable `DiagramAST` for various diagram types.
    - **Action**: Thoroughly evaluate its output for State Diagrams, Mindmaps, and other target types.
    - **Action**: Identify gaps where the AST does not provide sufficient detail for Excalidraw element conversion.
2.  **Contribution to Mermaid Ecosystem**: If `@mermaid-js/parser` is found lacking, contribute upstream to enhance its AST generation capabilities. This benefits the broader community.
3.  **Fallback to JISON Data**: For types where `@mermaid-js/parser` is not yet mature, continue to explore extracting structured data from Mermaid's internal JISON parsers (e.g., `yy.getVertices()`).
4.  **Deprioritize Bypassing Core `mermaid.parse()`**: The main `mermaid.parse()` function is primarily for validation and its `ParseResult` may not be a full AST. Focus efforts on dedicated parsing tools.

### Fallback Strategy Refinement

The current fallback to image rendering should be enhanced with better integration options. When individual shape rendering is not available, the plugin should provide clearer user feedback about the rendering method and offer options for manual conversion assistance. This could include tools for tracing over rendered images or semi-automatic shape detection from SVG output.

### Configuration and User Experience

The stretch goal of allowing users to choose between image and shape rendering should be promoted to a core feature. Different use cases may favor different rendering approaches, and providing user control over this choice enhances the plugin's flexibility. The configuration system should be diagram-type specific, allowing users to set preferences for each supported diagram type independently. This will be expanded with new feature toggles (see Section V).

---

## V. New Core Features & Enhancements

This section outlines new functionalities to be added to the plugin, enhancing its utility for managing diagrams within Obsidian.

### 1. Automated PNG Export for Excalidraw Files

- **Goal**: Provide users with an automated way to generate and save PNG versions of their `.excalidraw` files within the Obsidian vault.
- **Technical Approach**:
  - Implement a file watcher for `.excalidraw` files using `this.app.vault.on('modify', async (file) => { ... });`.
  - Alternatively, or additionally, provide a command palette action and/or a ribbon icon to trigger export for the active Excalidraw file or selected files.
  - Utilize the `@excalidraw/excalidraw` library's `exportToBlob` function with `mimeType: 'image/png'`.
    ```typescript
    // Conceptual snippet for Excalidraw to PNG export
    // import { exportToBlob } from "@excalidraw/excalidraw"; // Ensure correct import
    // async function exportExcalidrawToPng(file: TFile, plugin: YourPluginClass) {
    //   const excalidrawFileContent = await plugin.app.vault.read(file);
    //   const sceneData = JSON.parse(excalidrawFileContent);
    //
    //   const blob = await exportToBlob({ // This is a simplified call
    //     elements: sceneData.elements,
    //     appState: sceneData.appState || { viewBackgroundColor: '#FFFFFF', exportWithDarkMode: false },
    //     files: sceneData.files || null, // Important for embedded images in Excalidraw
    //     mimeType: 'image/png',
    //     getDimensions: (width, height) => ({ width, height, scale: 2 }) // Example for 2x scale
    //   });
    //
    //   if (blob) {
    //     const arrayBuffer = await blob.arrayBuffer();
    //     const outputPath = `${plugin.settings.excalidrawPngPath}/${file.basename}.png`;
    //     await plugin.app.vault.createBinary(outputPath, arrayBuffer);
    //     new Notice(`Exported ${file.basename} to PNG.`);
    //   }
    // }
    ```
  - Ensure proper handling of embedded images within Excalidraw files by passing `sceneData.files` to `exportToBlob`.
  - Manage output paths using `plugin.app.vault.adapter.getFullPath()` for robustness.
- **Settings**:
  - Toggle: "Enable automated PNG export for Excalidraw files on save."
  - Text Input: "Path for exported Excalidraw PNGs" (default: `ExcalidrawExports/`).

### 2. Mermaid to PNG Notelinking

- **Goal**: Allow users to convert Mermaid code blocks within their notes directly into embedded PNG images, replacing the original code block with a link to the generated image.
- **Technical Approach**:
  - **Detection**: Use a regular expression to find Mermaid code blocks: ` /^```mermaid\r?\n([\s\S]*?)\r?\n```$/gm `.
  - **Conversion & Rendering**:
    1.  The plugin will first convert the Mermaid code to Excalidraw elements using its existing core logic (`graphToExcalidraw`).
    2.  Then, it will take these Excalidraw elements and render them to a PNG using the same mechanism as the "Automated PNG Export for Excalidraw Files" feature (i.e., `exportToBlob` from `@excalidraw/excalidraw`).
  - **Storage & Linking**:
    - Generate a hash of the Mermaid code content to use as part of the PNG filename for caching and uniqueness (e.g., `mermaid-render-[hash].png`).
    - Store PNGs in a configurable vault location (default: `MermaidRenders/`).
    - Replace the original Mermaid code block in the editor with an Obsidian wikilink to the PNG: `![[${outputPath}]]`.
  - **Workflow**: This can be triggered by a command palette action, a context menu on the Mermaid block, or a CodeLens-style button above the block.
  - **Live Preview**: Investigate `registerMarkdownPostProcessor` to show a preview of the PNG or a button to convert, without altering the source until explicitly requested.
- **Settings**:
  - Toggle: "Enable Mermaid to PNG notelinking feature."
  - Text Input: "Path for Mermaid-rendered PNGs" (default: `MermaidRenders/`).
  - Option: "Automatically replace on render" vs. "Show preview, replace on click."

### 3. Plugin Settings Enhancements

- **Implementation**: Create a dedicated settings tab by extending `PluginSettingTab`.
- **UI**: Use `Setting` class with `addToggle()` for boolean options and `addText()` for path configurations.
  ```typescript
  // Conceptual snippet for settings tab
  // class MyPluginSettingTab extends PluginSettingTab {
  //   display(): void {
  //     const { containerEl } = this;
  //     containerEl.empty();
  //     containerEl.createEl('h2', { text: 'Mermaid to Excalidraw Settings' });
  //
  //     new Setting(containerEl)
  //       .setName('Enable Automated Excalidraw PNG Export')
  //       .setDesc('Automatically export .excalidraw files to PNG in the specified folder upon modification.')
  //       .addToggle(toggle => toggle
  //         .setValue(this.plugin.settings.enableExcalidrawAutoPng)
  //         .onChange(async (value) => {
  //           this.plugin.settings.enableExcalidrawAutoPng = value;
  //           await this.plugin.saveSettings();
  //         }));
  //
  //     new Setting(containerEl)
  //       .setName('Excalidraw PNG Export Path')
  //       .setDesc('Folder to save exported PNGs from .excalidraw files.')
  //       .addText(text => text
  //         .setPlaceholder('ExcalidrawExports/')
  //         .setValue(this.plugin.settings.excalidrawPngPath)
  //         .onChange(async (value) => {
  //           this.plugin.settings.excalidrawPngPath = value;
  //           await this.plugin.saveSettings();
  //         }));
  //
  //     // Similar settings for Mermaid to PNG Notelinking
  //   }
  // }
  ```
- **Persistence**: Ensure settings are loaded on plugin start (`loadSettings()`) and saved whenever changed (`saveSettings()`) using `this.loadData()` and `this.saveData()`.

---

## VI. Testing and Quality Assurance Strategy

The roadmap should include a comprehensive testing framework that covers both automated parsing accuracy and visual fidelity comparison. Automated tests should verify that converted diagrams maintain semantic accuracy while visual comparison tools should help identify rendering quality issues. The testing suite should include a diverse set of diagram examples covering edge cases and complex scenarios for each supported diagram type.

User feedback collection should be systematized through beta testing programs and regular community surveys. The plugin should include telemetry options (with user consent) to understand which diagram types are most commonly used and which conversion features provide the greatest value to users.

---

## VII. Community Engagement and Contribution Strategy

The roadmap should explicitly outline opportunities for community contribution beyond general "PRs welcome" statements. Specific areas where contributions would be most valuable include parser development for specific diagram types (especially for `@mermaid-js/parser`), test case creation, and documentation improvements. The project should establish clear contribution guidelines and provide detailed technical documentation to enable community developers to contribute effectively.

Collaboration with related projects in the ecosystem could accelerate development and reduce duplication of effort. The Obsidian-Excalidraw plugin community, in particular, represents a significant user base for this functionality. Cross-project collaboration could lead to shared parsing libraries or common conversion utilities that benefit multiple tools.

---

## VIII. Conclusion

This roadmap represents a solid foundation for expanding Mermaid to Excalidraw conversion capabilities, now including direct Excalidraw and Mermaid-to-image enhancements. The recommended updates prioritize state diagrams as the next implementation target while maintaining ambitious goals for mindmap support and comprehensive diagram type coverage. Success will depend on balancing technical feasibility with user demand, leveraging and contributing to the broader Mermaid ecosystem's parsing capabilities (especially `@mermaid-js/parser`), and implementing the new image export and notelinking features thoughtfully. The updated approach emphasizes community engagement, systematic testing, and flexible configuration options to ensure the plugin meets diverse user needs while maintaining high quality standards.

---

## IX. Plugin Distribution and Release

### 1. v1.0.0 - Initial Submission to Obsidian Community Plugins

- **Goal**: Prepare and submit the plugin for inclusion in the official Obsidian community plugin list.
- **Tasks**:
  - Ensure all prerequisites are met (README.md, LICENSE, manifest.json).
  - Finalize `manifest.json` for version 1.0.0 (confirm description, version, etc.).
  - Create a GitHub release for v1.0.0, tagging the correct commit.
  - Upload `main.js` and `manifest.json` as release assets.
  - Prepare and submit a Pull Request to the `obsidianmd/community-plugins` repository with the plugin's entry in `community-plugins.json`.
  - Address any feedback from the Obsidian review team.
- **Status**: In Progress

_Last updated: 2025-06-09_
