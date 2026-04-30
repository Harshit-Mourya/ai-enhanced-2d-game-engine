// src/engine/rendering/SvgRenderer.jsx

import { useSelector } from "react-redux";

export default function SvgRenderer() {
  //   console.log("SvgRenderer render");
  const player = useSelector((state) => state.entities.player);
  const enemies = useSelector((state) => state.entities.enemies);
  const gameStatus = useSelector((state) => state.entities.gameStatus);
  const survivalTime = useSelector((state) => state.entities.survivalTime);
  const difficultyLevel = useSelector(
    (state) => state.entities.difficultyLevel,
  );
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
      <text x="10" y="40" fill="white" fontSize="14">
        Survival Time: {survivalTime.toFixed(1)} sec
      </text>
      <text x="10" y="60" fill="white" fontSize="14">
        Difficulty: {difficultyLevel}
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
          fill={
            enemy.state === "attack"
              ? "red"
              : enemy.state === "chase"
                ? "#ff00ff"
                : "orange"
          }
        />
      ))}
      {gameStatus === "gameOver" && (
        <>
          <text x="300" y="180" fill="white" fontSize="32" textAnchor="middle">
            GAME OVER
          </text>

          <text x="300" y="220" fill="white" fontSize="16" textAnchor="middle">
            Press R to Restart
          </text>
        </>
      )}
    </svg>
  );
}
