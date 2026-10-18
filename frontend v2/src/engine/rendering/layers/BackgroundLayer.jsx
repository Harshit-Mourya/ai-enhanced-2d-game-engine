import planet0SVG from "../../../assets/characters/planet-0.svg";
import planet3SVG from "../../../assets/characters/planet-3.svg";
import planet5SVG from "../../../assets/characters/planet-5.svg";
import blackHoleSVG from "../../../assets/characters/black-hole.svg";

export default function BackgroundLayer({ width = 2000, height = 1500 }) {
  // Generate deterministic parallax background stars
  const stars = [];
  for (let i = 0; i < 120; i++) {
    const x = (i * 17 + 23) % width;
    const y = (i * 31 + 47) % height;
    const r = (i % 3) + 0.8;
    const opacity = 0.3 + (i % 5) * 0.15;
    stars.push({ x, y, r, opacity, key: i });
  }

  return (    <g className="pointer-events-none select-none">
      <defs>
        <radialGradient id="spaceGradient" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#0b0f19" />
          <stop offset="60%" stopColor="#040711" />
          <stop offset="100%" stopColor="#000208" />
        </radialGradient>

        <radialGradient id="nebula1" cx="30%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#0284c7" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="nebula2" cx="70%" cy="70%" r="50%">
          <stop offset="0%" stopColor="#7e22ce" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#7e22ce" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Deep Space Background Canvas */}
      <rect x="0" y="0" width={width} height={height} fill="url(#spaceGradient)" />

      {/* Cosmic Nebulae */}
      <rect x="0" y="0" width={width} height={height} fill="url(#nebula1)" />
      <rect x="0" y="0" width={width} height={height} fill="url(#nebula2)" />

      {/* Parallax Starfield */}
      {stars.map((star) => (
        <circle
          key={star.key}
          cx={star.x}
          cy={star.y}
          r={star.r}
          fill="#ffffff"
          opacity={star.opacity}
        />
      ))}

      {/* Ambient Sci-Fi Celestial Bodies */}
      <image href={blackHoleSVG} x={width - 450} y={100} width="160" height="160" opacity="0.35" />
      <image href={planet0SVG} x={150} y={height - 350} width="180" height="180" opacity="0.4" />
      <image href={planet3SVG} x={width / 2} y={150} width="120" height="120" opacity="0.3" />
      <image href={planet5SVG} x={width - 300} y={height - 250} width="140" height="140" opacity="0.3" />
    </g>
  );
}
