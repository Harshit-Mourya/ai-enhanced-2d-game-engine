// src/engine/rendering/SvgRenderer.jsx

import { gameState } from "../state/gameState";

export default function SvgRenderer() {
  //   console.log("SvgRenderer render");
  const { x, y } = gameState.player;

  return (
    <svg
      width="600"
      height="400"
      style={{ border: "1px solid white", background: "#070404" }}
    >
      {/* Player */}
      <rect x={x} y={y} width="30" height="30" fill="#00eeff" />
    </svg>
  );
}
