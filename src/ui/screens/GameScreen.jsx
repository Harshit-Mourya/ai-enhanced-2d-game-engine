import { useEffect, useState } from "react";

import EngineManager from "../../game/EngineManager";

import SvgRenderer from "../../engine/rendering/SvgRenderer";

import HUDOverlay from "../components/HUDOverlay";

import PauseMenu from "../components/PauseMenu";

import { GAME_STATES, SCREENS } from "../../state/appState";

import { useSelector, useDispatch } from "react-redux";

import GameOverScreen from "../components/GameOverScreen";

import { loadLevel } from "../../engine/state/store";

import level1 from "../../engine/levels/level1.json";

import VictoryScreen from "../components/VictoryScreen";
import parseMazeSVG from "../../engine/utils/parseMazeSVG";

import maze1SVG from "../../assets/mazes/maze-1.svg?raw";

const parsedWalls = parseMazeSVG(maze1SVG);
// console.log(parsedWalls.length);
// console.log(parsedWalls);

// const maxX = Math.max(...parsedWalls.map((wall) => wall.x + wall.width));

// const maxY = Math.max(...parsedWalls.map((wall) => wall.y + wall.height));

// console.log("World Width:", maxX);
// console.log("World Height:", maxY);

const svgLevel = {
  ...level1,
  walls: parsedWalls,
};

export default function GameScreen({ onExitToMenu }) {
  const [gameState, setGameState] = useState(GAME_STATES.RUNNING);

  const dispatch = useDispatch();

  const gameStatus = useSelector((state) => state.entities.gameStatus);

  // useEffect(() => {
  //   const handlePause = (e) => {
  //     if (e.key === "Escape") {
  //       setGameState((prev) =>
  //         prev === GAME_STATES.RUNNING
  //           ? GAME_STATES.PAUSED
  //           : GAME_STATES.RUNNING,
  //       );
  //     }
  //   };

  //   window.addEventListener("keydown", handlePause);

  //   return () => {
  //     window.removeEventListener("keydown", handlePause);
  //   };
  // }, []);

  useEffect(() => {
    dispatch(loadLevel(svgLevel));

    // ===============================
    // PAUSE HANDLER
    // ===============================

    const handlePause = (e) => {
      if (e.key === "Escape") {
        setGameState((prev) =>
          prev === GAME_STATES.RUNNING
            ? GAME_STATES.PAUSED
            : GAME_STATES.RUNNING,
        );
      }
    };

    window.addEventListener("keydown", handlePause);

    return () => {
      window.removeEventListener("keydown", handlePause);
    };
  }, [dispatch]);

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-black">
      <EngineManager isPaused={gameState === GAME_STATES.PAUSED} />

      <SvgRenderer />

      <HUDOverlay />

      <PauseMenu
        isPaused={gameState === GAME_STATES.PAUSED}
        onResume={() => setGameState(GAME_STATES.RUNNING)}
        onRestart={() => {
          dispatch(loadLevel(svgLevel));

          setGameState(GAME_STATES.RUNNING);
        }}
        onExit={onExitToMenu}
      />

      <GameOverScreen
        isVisible={gameStatus === "gameOver"}
        onRestart={() => {
          dispatch(loadLevel(svgLevel));

          setGameState(GAME_STATES.RUNNING);
        }}
        onExit={onExitToMenu}
      />

      <VictoryScreen
        isVisible={gameStatus === "victory"}
        onRestart={() => {
          dispatch(loadLevel(svgLevel));

          setGameState(GAME_STATES.RUNNING);
        }}
        onExit={onExitToMenu}
      />
    </div>
  );
}
