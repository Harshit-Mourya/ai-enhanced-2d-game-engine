import { useEffect } from "react";

import { useDispatch } from "react-redux";

import { startGameLoop, stopGameLoop } from "../engine/core/gameLoop";

import { setDirection, loadLevel } from "../engine/state/store";

import level1 from "../engine/levels/level1.json";

import { initializeInput } from "../engine/input/inputManager";

export default function EngineManager({ isPaused }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // initialize keyboard input system

    const cleanupInput = initializeInput(dispatch, setDirection);

    // restart handler

    const handleRestart = (e) => {
      if (e.key === "r" || e.key === "R") {
        stopGameLoop();

        dispatch(loadLevel(level1));

        startGameLoop();
      }
    };

    window.addEventListener("keydown", handleRestart);

    // load level

    dispatch(loadLevel(level1));

    return () => {
      cleanupInput();

      window.removeEventListener("keydown", handleRestart);

      stopGameLoop();
    };
  }, [dispatch]);

  useEffect(() => {
    if (isPaused) {
      stopGameLoop();
    } else {
      startGameLoop();
    }
  }, [isPaused]);

  return null;
}
