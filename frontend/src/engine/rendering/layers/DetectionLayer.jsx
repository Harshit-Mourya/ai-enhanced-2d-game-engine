export default function DetectionLayer({ enemies }) {
  if (!enemies) return null;

  return (
    <>
      {enemies.map((enemy) => (
        <circle
          key={`detect-${enemy.id}`}
          cx={enemy.x + 20}
          cy={enemy.y + 20}
          r={enemy.detectionRadius}
          stroke="#facc15"
          strokeDasharray="4"
          opacity="0.2"
          fill="none"
        />
      ))}
    </>
  );
}
