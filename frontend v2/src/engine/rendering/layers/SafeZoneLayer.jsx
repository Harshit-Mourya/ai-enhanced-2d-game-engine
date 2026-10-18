export default function SafeZoneLayer({ safeZones }) {
  if (!safeZones || safeZones.length === 0) return null;

  return (
    <g className="pointer-events-none select-none">
      <defs>
        <radialGradient id="safeDomeGradient">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
          <stop offset="70%" stopColor="#059669" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.35" />
        </radialGradient>
      </defs>

      {safeZones.map((zone) => {
        const cx = zone.x;
        const cy = zone.y;
        const r = zone.radius || 90;

        return (
          <g key={zone.id || `${cx}-${cy}`}>
            {/* Outer Pulsing Shield Aura */}
            <circle
              cx={cx}
              cy={cy}
              r={r + 6}
              fill="none"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="6 4"
              opacity="0.6"
            />

            {/* Forcefield Inner Fill */}
            <circle cx={cx} cy={cy} r={r} fill="url(#safeDomeGradient)" />

            {/* Glowing Border */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="#34d399"
              strokeWidth="2.5"
              className="drop-shadow-[0_0_12px_#10b981]"
            />

            {/* Safe Zone Text */}
            <text
              x={cx}
              y={cy - r - 12}
              fill="#34d399"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
              className="tracking-wider uppercase drop-shadow-[0_0_6px_#10b981]"
            >
              {zone.name || "Safe Haven"} (Shield Active)
            </text>
          </g>
        );
      })}
    </g>
  );
}
