export default function ArenaBorderLayer({ width, height }) {
  return (
    <rect
      x="0"
      y="0"
      width={width}
      height={height}
      fill="none"
      stroke="#22d3ee"
      strokeWidth="4"
      rx="6"
    />
  );
}
