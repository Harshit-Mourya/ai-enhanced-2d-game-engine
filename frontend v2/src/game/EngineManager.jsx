import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startGameLoop, stopGameLoop } from "../engine/core/gameLoop";
import { setDirection } from "../engine/state/store";
import { initializeInput } from "../engine/input/inputManager";

export default function EngineManager({ isPaused }) {
  const dispatch = useDispatch();
  const currentLevelId = useSelector((state) => state.entities.currentLevelId);

  // Initialize input once; don't tear it down on every level change.
  useEffect(() => {
    const cleanupInput = initializeInput(dispatch, setDirection);

    return () => {
      cleanupInput();
    };
  }, [dispatch]);

  // Restart the game loop whenever the pause state or sector changes.
  useEffect(() => {
    if (isPaused) {
      stopGameLoop();
      return;
    }

    startGameLoop();

    return () => {
      stopGameLoop();
    };
  }, [isPaused, currentLevelId]);

  return null;
}
