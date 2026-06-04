export default function parseMazeSVG(svgText) {
  const parser = new DOMParser();

  const svgDoc = parser.parseFromString(svgText, "image/svg+xml");

  const lineElements = svgDoc.querySelectorAll("line");

  const SCALE = 4;

  const walls = [];

  lineElements.forEach((line) => {
    const x1 = parseFloat(line.getAttribute("x1"));

    const y1 = parseFloat(line.getAttribute("y1"));

    const x2 = parseFloat(line.getAttribute("x2"));

    const y2 = parseFloat(line.getAttribute("y2"));

    // ===============================
    // HORIZONTAL WALL
    // ===============================

    if (y1 === y2) {
      walls.push({
        x: Math.min(x1, x2) * SCALE,

        y: y1 * SCALE,

        width: Math.abs(x2 - x1) * SCALE,

        height: 1,
      });
    }

    // ===============================
    // VERTICAL WALL
    // ===============================
    else if (x1 === x2) {
      walls.push({
        x: x1 * SCALE,

        y: Math.min(y1, y2) * SCALE,

        width: 1,

        height: Math.abs(y2 - y1) * SCALE,
      });
    }
  });

  return walls;
}
