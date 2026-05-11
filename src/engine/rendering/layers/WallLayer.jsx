export default function WallLayer({ walls }) {
  if (!walls) return null;

  return (
    <>
      {walls.map((wall, index) => (
        <rect
          key={index}
          x={wall.x}
          y={wall.y}
          width={wall.width}
          height={wall.height}
          fill="#1e293b"
          stroke="#22d3ee"
          strokeWidth="2"
          rx="4"
        />
      ))}
    </>
  );
}
