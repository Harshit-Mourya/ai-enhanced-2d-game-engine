import GameRenderer from "./GameRenderer";

export default function SvgRenderer() {
  return (
    <svg
      width="1000"
      height="700"
      style={{
        border: "1px solid white",
        background: "#070404",
      }}
    >
      <GameRenderer />
    </svg>
  );
}
