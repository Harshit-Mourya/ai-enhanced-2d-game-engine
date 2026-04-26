import { useEffect, useState } from "react";
import { startGameLoop, stopGameLoop } from "./engine/core/gameLoop";
import SvgRenderer from "./engine/rendering/SvgRenderer";
import { useDispatch } from "react-redux";
import { setDirection } from "./engine/state/store";
import level1 from "./engine/levels/level1.json";
import { loadLevel } from "./engine/state/store";
import { initializeInput } from "./engine/input/inputManager";

function App() {
  const [, setTick] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const cleanupInput = initializeInput(dispatch, setDirection);

    dispatch(loadLevel(level1));
    startGameLoop();

    return () => {
      cleanupInput();
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
