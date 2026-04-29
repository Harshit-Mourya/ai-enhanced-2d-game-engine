import { useEffect, useState } from "react";
import { startGameLoop, stopGameLoop } from "./engine/core/gameLoop";
import SvgRenderer from "./engine/rendering/SvgRenderer";
import { useDispatch } from "react-redux";
import { setDirection, loadLevel } from "./engine/state/store";
import level1 from "./engine/levels/level1.json";
import { initializeInput } from "./engine/input/inputManager";

function App() {
  const [, setTick] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    // initialize keyboard input system
    const cleanupInput = initializeInput(dispatch, setDirection);

    // restart handler (press R)
    const handleRestart = (e) => {
      if (e.key === "r" || e.key === "R") {
        stopGameLoop();

        dispatch(loadLevel(level1));

        startGameLoop();
      }
    };

    window.addEventListener("keydown", handleRestart);

    // load level when app starts
    dispatch(loadLevel(level1));

    // start engine loop
    startGameLoop();

    return () => {
      cleanupInput();

      window.removeEventListener("keydown", handleRestart);

      stopGameLoop();
    };
  }, [dispatch]);

  return (
    <div className="app">
      <h1 className="title">AI-Enhanced Game Engine</h1>

      <p className="instructions">Use ← ↑ ↓ → arrow keys to move</p>

      <div className="game-container">
        <SvgRenderer />
      </div>
    </div>
  );
}

export default App;
