import { useEffect, useState } from "react";
import { startGameLoop, stopGameLoop } from "./engine/core/gameLoop";
import SvgRenderer from "./engine/rendering/SvgRenderer";
import { useDispatch } from "react-redux";
import { setDirection } from "./engine/state/store";
import level1 from "./engine/levels/level1.json";
import { loadLevel } from "./engine/state/store";

function App() {
  const [, setTick] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    // 🔑 KEY DOWN
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowRight":
          dispatch(setDirection({ dx: 1 }));
          break;
        case "ArrowLeft":
          dispatch(setDirection({ dx: -1 }));
          break;
        case "ArrowUp":
          dispatch(setDirection({ dy: -1 }));
          break;
        case "ArrowDown":
          dispatch(setDirection({ dy: 1 }));
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
          dispatch(setDirection({ dx: 0 }));
          break;
        case "ArrowUp":
        case "ArrowDown":
          dispatch(setDirection({ dy: 0 }));
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // 🎮 GAME LOOP
    dispatch(loadLevel(level1));
    startGameLoop();

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
