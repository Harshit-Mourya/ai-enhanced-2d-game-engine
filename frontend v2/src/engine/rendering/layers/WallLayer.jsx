export default function WallLayer({ walls }) {
  if (!walls || walls.length === 0) return null;

  return (
    <g className="pointer-events-none select-none">
      <defs>
        <linearGradient id="wallGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="50%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {walls.map((wall, index) => {
        const isThin = wall.width <= 10 || wall.height <= 10;
        return (
          <g key={index}>
            {/* Dark Wall Base */}
            <rect
              x={wall.x}
              y={wall.y}
              width={wall.width}
              height={wall.height}
              fill="url(#wallGlow)"
              rx={isThin ? "2" : "4"}
            />

            {/* Neon Cyan Sci-Fi Border Glow */}
            <rect
              x={wall.x}
              y={wall.y}
              width={wall.width}
              height={wall.height}
              fill="none"
              stroke="#0284c7"
              strokeWidth="1.5"
              rx={isThin ? "2" : "4"}
              className="drop-shadow-[0_0_6px_#38bdf8]"
            />

            {/* Core Energy Conduit Line */}
            {isThin && wall.width > wall.height && (
              <line
                x1={wall.x}
                y1={wall.y + wall.height / 2}
                x2={wall.x + wall.width}
                y2={wall.y + wall.height / 2}
                stroke="#38bdf8"
                strokeWidth="1"
                opacity="0.8"
              />
            )}
            {isThin && wall.height > wall.width && (
              <line
                x1={wall.x + wall.width / 2}
                y1={wall.y}
                x2={wall.x + wall.width / 2}
                y2={wall.y + wall.height}
                stroke="#38bdf8"
                strokeWidth="1"
                opacity="0.8"
              />
            )}
          </g>
        );
      })}
    </g>
  );
}
