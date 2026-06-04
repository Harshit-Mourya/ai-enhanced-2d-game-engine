export default function BackgroundLayer({ width, height }) {
  return (
    <>
      <defs>
        <radialGradient id="bgGradient">
          <stop offset="0%" stopColor="#020617" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>
      </defs>

      <rect width={width} height={height} fill="url(#bgGradient)" />
    </>
  );
}
