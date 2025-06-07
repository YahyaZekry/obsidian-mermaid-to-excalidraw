# Mermaid to Excalidraw Plugin Roadmap: Analysis and Strategic Recommendations

The roadmap presented outlines an ambitious and well-structured approach to enhancing the Mermaid to Excalidraw plugin capabilities. Based on current developments in the ecosystem and technical constraints, this analysis provides comprehensive recommendations for optimizing the implementation strategy and updating the roadmap to reflect the latest technical landscape.

---

## Current Ecosystem Assessment

The Mermaid to Excalidraw conversion landscape has evolved significantly since the roadmap's initial conception. The official `@excalidraw/mermaid-to-excalidraw` package currently supports only flowcharts for individual shape rendering, with other diagram types falling back to image rendering. This limitation stems from the complexity of parsing different Mermaid diagram structures and converting them to Excalidraw's element format. The parsing process involves two critical steps: rendering Mermaid diagrams to SVG for positional information and parsing the Mermaid syntax to understand element connections and relationships.

Recent developments in the Mermaid ecosystem present both opportunities and challenges for the roadmap. Mermaid has introduced 30 new flowchart shapes, significantly expanding visual representation capabilities. However, the core challenge remains in accessing Mermaid's Abstract Syntax Tree (AST) for different diagram types. The community has long requested better AST access, with discussions dating back to 2021, but no comprehensive solution has emerged. The `@mermaid-js/parser` package offers some parsing capabilities, but its coverage across all diagram types remains limited.

---

## Technical Implementation Recommendations

### Priority Reordering and Feasibility Assessment

The roadmap should prioritize diagram types based on both user demand and technical feasibility. **State diagrams** represent the most viable next target for individual shape rendering due to their relatively simple structure consisting of states (nodes) and transitions (edges). State diagrams have clear semantic boundaries and well-defined relationships that translate naturally to Excalidraw elements. The syntax includes basic states, transitions, composite states, and special markers for start and end states, all of which can be mapped to corresponding Excalidraw shapes.

**Mindmap diagrams**, while highly requested, present greater technical challenges due to their hierarchical nature and automatic layout algorithms. The Mermaid mindmap syntax relies heavily on indentation-based hierarchy, which requires sophisticated parsing to maintain spatial relationships when converting to individual Excalidraw elements. However, the growing demand for mindmap functionality, evidenced by community discussions and feature requests, suggests this should remain a high-priority item despite implementation complexity.

### Enhanced Parser Strategy

The roadmap should incorporate a multi-layered parsing approach to handle the varying complexity of different diagram types. For simpler diagrams like state diagrams, direct AST parsing through the Mermaid API's `getDiagramFromText` function provides sufficient data extraction capabilities. More complex diagrams may require hybrid approaches combining AST data with SVG analysis to capture layout and positioning information accurately.

The recent emergence of AI-assisted diagram generation tools suggests an alternative approach worth exploring. Rather than relying solely on traditional parsing methods, the plugin could leverage AI models to interpret Mermaid syntax and generate appropriate Excalidraw element structures. This approach could prove particularly valuable for complex diagram types where traditional parsing faces limitations.

---

## Updated Roadmap Structure

### Phase 1: State Diagram Implementation (High Priority)

State diagrams should be elevated to the highest priority position due to their favorable complexity-to-value ratio. The implementation should focus on basic state representation using Excalidraw rectangles and ellipses, with transitions represented as labeled arrows. Special attention should be given to composite states, which can be represented using Excalidraw's grouping functionality to maintain hierarchical relationships.

The state diagram parser should handle all standard Mermaid state diagram features including start and end states marked with `[*]`, conditional paths using choice points, and concurrent states represented through parallel composition. The implementation should also support notes and styling options to maintain visual fidelity with the original Mermaid output.

### Phase 2: Enhanced Flowchart Support

Before expanding to entirely new diagram types, the roadmap should include improvements to existing flowchart support. Mermaid's recent introduction of 30 new flowchart shapes requires corresponding updates to the conversion logic. The new shapes use simplified syntax structures that may require parser modifications to handle properly. This phase should also address any existing limitations in flowchart conversion, such as subgraph handling or complex arrow routing.

### Phase 3: Mindmap Implementation (Medium-High Priority)

Mindmap implementation should proceed with a phased approach focusing initially on basic hierarchical structures before adding advanced features. The parser should extract the root node and branch relationships from Mermaid's indentation-based syntax. Initial implementation can use simple rectangular nodes with connecting lines, with future iterations adding more sophisticated node shapes and automatic layout improvements.

The mindmap implementation faces unique challenges in preserving the automatic layout characteristics that make Mermaid mindmaps visually appealing. The conversion process should attempt to maintain relative positioning and hierarchical spacing while allowing users to modify individual elements in Excalidraw.

---

## Technical Infrastructure Improvements

### Enhanced AST Access

The roadmap should include contributions to the broader Mermaid ecosystem to improve AST access across diagram types. The community has consistently requested better programmatic access to parsed diagram structures. Collaborating with the Mermaid maintainers to enhance the `@mermaid-js/parser` package could benefit not only this plugin but the entire ecosystem of Mermaid-based tools.

### Fallback Strategy Refinement

The current fallback to image rendering should be enhanced with better integration options. When individual shape rendering is not available, the plugin should provide clearer user feedback about the rendering method and offer options for manual conversion assistance. This could include tools for tracing over rendered images or semi-automatic shape detection from SVG output.

### Configuration and User Experience

The stretch goal of allowing users to choose between image and shape rendering should be promoted to a core feature. Different use cases may favor different rendering approaches, and providing user control over this choice enhances the plugin's flexibility. The configuration system should be diagram-type specific, allowing users to set preferences for each supported diagram type independently.

---

## Testing and Quality Assurance Strategy

The roadmap should include a comprehensive testing framework that covers both automated parsing accuracy and visual fidelity comparison. Automated tests should verify that converted diagrams maintain semantic accuracy while visual comparison tools should help identify rendering quality issues. The testing suite should include a diverse set of diagram examples covering edge cases and complex scenarios for each supported diagram type.

User feedback collection should be systematized through beta testing programs and regular community surveys. The plugin should include telemetry options (with user consent) to understand which diagram types are most commonly used and which conversion features provide the greatest value to users.

---

## Community Engagement and Contribution Strategy

The roadmap should explicitly outline opportunities for community contribution beyond general "PRs welcome" statements. Specific areas where contributions would be most valuable include parser development for specific diagram types, test case creation, and documentation improvements. The project should establish clear contribution guidelines and provide detailed technical documentation to enable community developers to contribute effectively.

Collaboration with related projects in the ecosystem could accelerate development and reduce duplication of effort. The Obsidian-Excalidraw plugin community, in particular, represents a significant user base for this functionality. Cross-project collaboration could lead to shared parsing libraries or common conversion utilities that benefit multiple tools.

---

## Conclusion

This roadmap represents a solid foundation for expanding Mermaid to Excalidraw conversion capabilities. The recommended updates prioritize state diagrams as the next implementation target while maintaining ambitious goals for mindmap support and comprehensive diagram type coverage. Success will depend on balancing technical feasibility with user demand while contributing to the broader ecosystem's parsing capabilities. The updated approach emphasizes community engagement, systematic testing, and flexible configuration options to ensure the plugin meets diverse user needs while maintaining high quality standards.

_Last updated: 2025-06-07_
