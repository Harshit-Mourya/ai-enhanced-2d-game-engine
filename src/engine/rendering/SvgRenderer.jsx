// src/engine/rendering/SvgRenderer.jsx

import { useSelector } from "react-redux";

export default function SvgRenderer() {
  //   console.log("SvgRenderer render");
  const player = useSelector((state) => state.entities.player);

  return (
    <svg
      width="600"
      height="400"
      style={{ border: "1px solid white", background: "#070404" }}
    >
      {/* Player */}
      <rect x={player.x} y={player.y} width="30" height="30" fill="#00eeff" />
    </svg>
  );
}
