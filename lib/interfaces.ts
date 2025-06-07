export enum VERTEX_TYPE {
  ROUND = "round",
  STADIUM = "stadium",
  DOUBLECIRCLE = "doublecircle",
  CIRCLE = "circle",
  DIAMOND = "diamond",
}

export enum LABEL_STYLE_PROPERTY {
  COLOR = "color",
}

export enum CONTAINER_STYLE_PROPERTY {
  FILL = "fill",
  STROKE = "stroke",
  STROKE_WIDTH = "stroke-width",
  STROKE_DASHARRAY = "stroke-dasharray",
}

export interface Vertex {
  id: string;
  type: VERTEX_TYPE;
  labelType: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  link?: string;
  containerStyle: { [key in CONTAINER_STYLE_PROPERTY]?: string };
  labelStyle: { [key in LABEL_STYLE_PROPERTY]?: string };
}

export interface SubGraph {
  id: string;
  nodeIds: string[];
  text: string;
  labelType: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface GraphImage {
  type: "graphImage";
  mimeType: string;
  dataURL: string;
  width: number;
  height: number;
}

// Simplified interface for Excalidraw elements
export interface ExcalidrawElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  strokeColor: string;
  backgroundColor: string;
  fillStyle: string;
  strokeWidth: number;
  strokeStyle: string;
  roughness: number;
  opacity: number;
  seed: number;
  version: number;
  versionNonce: number;
  isDeleted: boolean;
  [key: string]: any;
}

export interface ExcalidrawTextElement extends ExcalidrawElement {
  type: "text";
  text: string;
  fontSize: number;
  fontFamily: string;
  textAlign: string;
  verticalAlign: string;
}

export interface ExcalidrawRectangleElement extends ExcalidrawElement {
  type: "rectangle";
}

export interface ExcalidrawDiamondElement extends ExcalidrawElement {
  type: "diamond";
}

export interface ExcalidrawEllipseElement extends ExcalidrawElement {
  type: "ellipse";
}

export interface ExcalidrawArrowElement extends ExcalidrawElement {
  type: "arrow";
  points: Position[];
  startArrowhead: string | null;
  endArrowhead: string | null;
}

export interface MermaidToExcalidrawResult {
  elements: ExcalidrawElement[];
  files?: { [key: string]: any };
}

export interface Flowchart {
  type: "flowchart";
  vertices: any[];
  edges: any[];
  direction: string;
}

export interface Sequence {
  type: "sequence";
  actors: any[];
  messages: any[];
}

export interface Class {
  type: "class";
  classes: any[];
  relations: any[];
}
