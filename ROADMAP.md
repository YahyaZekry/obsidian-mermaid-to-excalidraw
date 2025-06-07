# Mermaid to Excalidraw Plugin: Diagram Rendering Roadmap

## Goal

Transition more Mermaid diagram types (such as Mindmap and State Diagram) from "single image" rendering to "individual shapes" rendering in Excalidraw, similar to how Flowcharts are currently handled.

---

## Why?

- **Better Editing:** Individual shapes allow users to move, edit, and annotate diagram components in Excalidraw.
- **Consistency:** Flowcharts already use this approach; extending it to other types will make the plugin more powerful and flexible.
- **Unlock Excalidraw Features:** Enables grouping, linking, and styling at the shape level.

---

## Current State

| Diagram Type         | Rendering Method     | Notes                               |
| -------------------- | -------------------- | ----------------------------------- |
| Flowchart            | ✅ Individual shapes | Fully supported                     |
| Sequence Diagram     | ⚠️ Individual shapes | Basic, but not visually optimal     |
| Gantt, Pie, ER, etc. | 🖼️ Single image      | Visual only, not editable           |
| State Diagram        | 🖼️ Single image      | Needs shape-based rendering         |
| Mindmap              | 🖼️ Single image      | Needs shape-based rendering         |
| Class Diagram        | 🔄 Individual shapes | Recently enabled, needs improvement |

---

## Roadmap Plan

### 1. **Mindmap Diagrams**

- [ ] Investigate Mermaid's mindmap AST or SVG output
- [ ] Write a parser to extract nodes and edges as shapes
- [ ] Map nodes to Excalidraw rectangles/ellipses, edges to arrows/lines
- [ ] Preserve hierarchy and text labels

### 2. **State Diagrams**

- [ ] Analyze Mermaid's state diagram structure
- [ ] Parse states and transitions into Excalidraw shapes/arrows
- [ ] Support for entry/exit points, composite states, and labels

### 3. **Other Complex Diagrams**

- [ ] Evaluate feasibility for ER, Journey, Requirement, Timeline
- [ ] Prioritize based on user demand and Mermaid/core-lib capabilities

### 4. **Refactor Core-lib (if needed)**

- [ ] Contribute upstream to core-lib for better AST/element output
- [ ] Add fallback to SVG-to-shapes conversion if AST is not available

### 5. **Testing & User Feedback**

- [ ] Create test notes with all diagram types
- [ ] Compare "single image" vs "individual shapes" output
- [ ] Gather user feedback and iterate

---

## Stretch Goals

- [ ] Add plugin setting to choose between "image" and "shapes" rendering per diagram type
- [ ] Support for custom styling and color mapping
- [ ] Export Excalidraw diagrams back to Mermaid (round-trip)

---

## Contributors

- [ ] Open to PRs and suggestions!

---

_Last updated: 2025-06-07_
