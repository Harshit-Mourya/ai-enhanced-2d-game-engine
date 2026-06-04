const GRID_SIZE = 40;

export default function GridLayer({ width, height }) {
  const lines = [];

  for (let x = 0; x <= width; x += GRID_SIZE) {
    lines.push(
      <line
        key={`v-${x}`}
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        stroke="#22c55e"
        strokeOpacity="0.08"
      />,
    );
  }

  for (let y = 0; y <= height; y += GRID_SIZE) {
    lines.push(
      <line
        key={`h-${y}`}
        x1={0}
        y1={y}
        x2={width}
        y2={y}
        stroke="#22c55e"
        strokeOpacity="0.08"
      />,
    );
  }

  return <g>{lines}</g>;
}
