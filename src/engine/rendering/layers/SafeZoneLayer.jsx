export default function SafeZoneLayer({ safeZones }) {
  if (!safeZones) return null;

  return (
    <>
      {safeZones.map((zone, index) => (
        <circle
          key={index}
          cx={zone.x}
          cy={zone.y}
          r={zone.radius}
          fill="#22c55e"
          opacity="0.15"
        />
      ))}
    </>
  );
}
