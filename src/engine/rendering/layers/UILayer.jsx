import { useSelector } from "react-redux";

export default function UILayer() {
  const { player, survivalTime, difficultyLevel, enemies, gameStatus } =
    useSelector((state) => state.entities);

  return (
    <>
      <text x="10" y="20" fill="white">
        Health: {player.health}
      </text>

      <text x="10" y="40" fill="white">
        Survival Time: {survivalTime.toFixed(1)}
      </text>

      <text x="10" y="60" fill="white">
        Difficulty: {difficultyLevel}
      </text>

      <text x="10" y="80" fill="white">
        Enemies: {enemies.length}
      </text>

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
    </>
  );
}
