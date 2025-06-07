import { Position } from "./interfaces";

// Convert mermaid entity codes to text e.g. "#9829;" to "♥"
export const entityCodesToText = (input: string): string => {
  input = decodeEntities(input);
  // Append & before the pattern #(\d+); or #([a-z]+); to convert to decimal code
  // so it can be rendered as html character
  // eg #9829; => &#9829;
  const inputWithDecimalCode = input
    .replace(/#(\d+);/g, "&#$1;")
    .replace(/#([a-z]+);/g, "&$1;");

  // Render the decimal code as html character, eg &#9829; => ♥
  const element = document.createElement("textarea");
  element.innerHTML = inputWithDecimalCode;
  return element.value;
};

export const getTransformAttr = (el: Element) => {
  const transformAttr = el.getAttribute("transform");
  const translateMatch = transformAttr?.match(
    /translate\(([ \d.-]+),\s*([\d.-]+)\)/
  );
  let transformX = 0;
  let transformY = 0;
  if (translateMatch) {
    transformX = Number(translateMatch[1]);
    transformY = Number(translateMatch[2]);
  }
  return { transformX, transformY };
};

//TODO Once fixed in mermaid this will be removed
export const encodeEntities = (text: string) => {
  let txt = text;

  txt = txt.replace(/style.*:\S*#.*;/g, (s) => {
    return s.substring(0, s.length - 1);
  });
  txt = txt.replace(/classDef.*:\S*#.*;/g, (s) => {
    return s.substring(0, s.length - 1);
  });

  txt = txt.replace(/#\w+;/g, (s) => {
    const innerTxt = s.substring(1, s.length - 1);

    const isInt = /^\+?\d+$/.test(innerTxt);
    if (isInt) {
      return `ﬂ°°${innerTxt}¶ß`;
    }
    return `ﬂ°${innerTxt}¶ß`;
  });

  return txt;
};

export const decodeEntities = (text: string) => {
  let txt = text;

  txt = txt.replace(/ﬂ°°(.+?)¶ß/g, (_, p1) => {
    return `&#${p1};`;
  });
  txt = txt.replace(/ﬂ°(.+?)¶ß/g, (_, p1) => {
    return `&${p1};`;
  });

  return txt;
};

export const calculateCurvature = (
  startPoint: Position,
  endPoint: Position,
  curvature: number = 0.5
): Position => {
  const midX = (startPoint.x + endPoint.x) / 2;
  const midY = (startPoint.y + endPoint.y) / 2;

  // Calculate the slope of the line connecting startPoint and endPoint
  const slope = (endPoint.y - startPoint.y) / (endPoint.x - startPoint.x);

  // Calculate the perpendicular slope
  const perpSlope = -1 / slope;

  // Calculate the angle of the line
  const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
  
  // Calculate the perpendicular angle
  const perpAngle = angle + Math.PI / 2;

  // Calculate the distance between the midpoint and the control point
  const distance = Math.sqrt(
    Math.pow(endPoint.x - startPoint.x, 2) + 
    Math.pow(endPoint.y - startPoint.y, 2)
  ) * curvature;

  // Calculate the control point position
  const controlX = midX + Math.cos(perpAngle) * distance;
  const controlY = midY + Math.sin(perpAngle) * distance;

  return { x: controlX, y: controlY };
};
