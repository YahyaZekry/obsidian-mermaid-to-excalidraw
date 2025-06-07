import { GraphImage, MermaidToExcalidrawResult, Flowchart, Sequence, Class } from "./interfaces";
import { nanoid } from "nanoid";

export const graphToExcalidraw = (
  graph: Flowchart | GraphImage | Sequence | Class
): MermaidToExcalidrawResult => {
  switch (graph.type) {
    case "graphImage": {
      // For image-based graphs, create an image element in Excalidraw
      return {
        elements: [
          {
            id: nanoid(),
            type: "image",
            x: 0,
            y: 0,
            width: graph.width,
            height: graph.height,
            angle: 0,
            strokeColor: "transparent",
            backgroundColor: "transparent",
            fillStyle: "solid",
            strokeWidth: 1,
            strokeStyle: "solid",
            roughness: 1,
            opacity: 100,
            seed: Math.floor(Math.random() * 100000),
            version: 1,
            versionNonce: 1,
            isDeleted: false,
            fileId: "mermaid-diagram",
            status: "saved",
            dataURL: graph.dataURL,
          }
        ],
        files: {
          "mermaid-diagram": {
            id: "mermaid-diagram",
            dataURL: graph.dataURL,
            mimeType: graph.mimeType,
            created: Date.now(),
          }
        }
      };
    }

    case "flowchart": {
      // Simplified conversion of flowchart to Excalidraw elements
      // In a real implementation, this would be much more complex
      return {
        elements: [
          // Example text element - in a real implementation, we'd create elements based on the flowchart data
          {
            id: nanoid(),
            type: "text",
            x: 50,
            y: 50,
            width: 200,
            height: 30,
            angle: 0,
            strokeColor: "#000000",
            backgroundColor: "transparent",
            fillStyle: "solid",
            strokeWidth: 1,
            strokeStyle: "solid",
            roughness: 1,
            opacity: 100,
            seed: Math.floor(Math.random() * 100000),
            version: 1,
            versionNonce: 1,
            isDeleted: false,
            text: "Flowchart (simplified conversion)",
            fontSize: 20,
            fontFamily: 1,
            textAlign: "center",
            verticalAlign: "middle"
          }
        ]
      };
    }

    case "sequence": {
      // Simplified conversion of sequence diagram to Excalidraw elements
      return {
        elements: [
          // Example text element
          {
            id: nanoid(),
            type: "text",
            x: 50,
            y: 50,
            width: 200,
            height: 30,
            angle: 0,
            strokeColor: "#000000",
            backgroundColor: "transparent",
            fillStyle: "solid",
            strokeWidth: 1,
            strokeStyle: "solid",
            roughness: 1,
            opacity: 100,
            seed: Math.floor(Math.random() * 100000),
            version: 1,
            versionNonce: 1,
            isDeleted: false,
            text: "Sequence Diagram (simplified conversion)",
            fontSize: 20,
            fontFamily: 1,
            textAlign: "center",
            verticalAlign: "middle"
          }
        ]
      };
    }

    case "class": {
      // Simplified conversion of class diagram to Excalidraw elements
      return {
        elements: [
          // Example text element
          {
            id: nanoid(),
            type: "text",
            x: 50,
            y: 50,
            width: 200,
            height: 30,
            angle: 0,
            strokeColor: "#000000",
            backgroundColor: "transparent",
            fillStyle: "solid",
            strokeWidth: 1,
            strokeStyle: "solid",
            roughness: 1,
            opacity: 100,
            seed: Math.floor(Math.random() * 100000),
            version: 1,
            versionNonce: 1,
            isDeleted: false,
            text: "Class Diagram (simplified conversion)",
            fontSize: 20,
            fontFamily: 1,
            textAlign: "center",
            verticalAlign: "middle"
          }
        ]
      };
    }

    default: {
      throw new Error(
        `graphToExcalidraw: unknown graph type "${
          (graph as any).type
        }, only flowcharts, sequence diagrams, and class diagrams are supported!"`
      );
    }
  }
};
