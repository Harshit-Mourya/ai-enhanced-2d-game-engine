// src/engine/rendering/SvgRenderer.jsx

import { useSelector } from "react-redux";

export default function SvgRenderer() {
  //   console.log("SvgRenderer render");
  const player = useSelector((state) => state.entities.player);
  const enemies = useSelector((state) => state.entities.enemies);
  return (
    <svg
      width="600"
      height="400"
      style={{ border: "1px solid white", background: "#070404" }}
    >
      {/* Player */}
      <text x="10" y="20" fill="white" fontSize="14">
        Health: {Math.round(player.health)}
      </text>
      <rect
        x={player.x}
        y={player.y}
        width="30"
        height="30"
        fill={player.collided ? "yellow" : "#00eeff"}
      />

      {/* Enemy */}
      {enemies.map((enemy, index) => (
        <rect
          key={index}
          x={enemy.x}
          y={enemy.y}
          width="30"
          height="30"
          fill={enemy.state === "chase" ? "red" : "orange"}
        />
      ))}
    </svg>
  );
}
