import { useEffect, useState } from "react";
import { startGameLoop, stopGameLoop } from "./engine/core/gameLoop";
import { gameState } from "./engine/state/gameState";
import SvgRenderer from "./engine/rendering/SvgRenderer";

function App() {
  const [, setTick] = useState(0);

  useEffect(() => {
    // 🔑 KEY DOWN
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowRight":
          gameState.player.dx = 1;
          break;
        case "ArrowLeft":
          gameState.player.dx = -1;
          break;
        case "ArrowUp":
          gameState.player.dy = -1;
          break;
        case "ArrowDown":
          gameState.player.dy = 1;
          break;
        default:
          break;
      }
    };

    // 🔑 KEY UP
    const handleKeyUp = (e) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowLeft":
          gameState.player.dx = 0;
          break;
        case "ArrowUp":
        case "ArrowDown":
          gameState.player.dy = 0;
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // 🎮 GAME LOOP
    startGameLoop(() => {
      const p = gameState.player;

      p.x += p.speed * p.dx;
      p.y += p.speed * p.dy;

      // 🧱 boundaries (SVG: 600x400, player: 30x30)
      if (p.x < 0) p.x = 0;
      if (p.x > 570) p.x = 570;
      if (p.y < 0) p.y = 0;
      if (p.y > 370) p.y = 370;

      setTick((t) => t + 1); // force render
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      stopGameLoop();
    };
  }, []);

  return (
    <div className="app">
      <h1 className="title">AI-Enhanced Game Engine</h1>
      <p className="instructions">Use ← ↑ ↓ → arrow keys to move</p>{" "}
      <div className="game-container">
        <SvgRenderer />{" "}
      </div>
    </div>
  );
}

export default App;
