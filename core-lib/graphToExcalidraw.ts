import { ExcalidrawConfig } from "./index.js";
import { FlowchartToExcalidrawSkeletonConverter } from "./converter/types/flowchart.js";
import { GraphImageConverter } from "./converter/types/graphImage.js";
import { GraphImage, MermaidToExcalidrawResult } from "./interfaces.js";
import { SequenceToExcalidrawSkeletonConvertor } from "./converter/types/sequence.js";
import { Sequence } from "./parser/sequence.js";
import { Flowchart } from "./parser/flowchart.js";
import { Class } from "./parser/class.js";
import { classToExcalidrawSkeletonConvertor } from "./converter/types/class.js";

export const graphToExcalidraw = (
  graph: Flowchart | GraphImage | Sequence | Class,
  options: ExcalidrawConfig = {}
): MermaidToExcalidrawResult => {
  switch (graph.type) {
    case "graphImage": {
      return GraphImageConverter.convert(graph, options);
    }

    case "flowchart": {
      return FlowchartToExcalidrawSkeletonConverter.convert(graph, options);
    }

    case "sequence": {
      return SequenceToExcalidrawSkeletonConvertor.convert(graph, options);
    }

    case "class": {
      return classToExcalidrawSkeletonConvertor.convert(graph, options);
    }

    default: {
      // Safely access type for error reporting, and update the error message
      const graphType =
        typeof graph === "object" && graph !== null && "type" in graph
          ? String((graph as { type: unknown }).type)
          : "unknown type (input was not a recognized graph object)";
      throw new Error(
        `graphToExcalidraw: unknown or unsupported graph type "${graphType}". Supported types are 'flowchart-v2', 'sequence', 'classDiagram', and 'graphImage'.`
      );
    }
  }
};
