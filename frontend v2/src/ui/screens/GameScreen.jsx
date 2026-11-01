import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch, useStore } from "react-redux";

import EngineManager from "../../game/EngineManager";
import SvgRenderer from "../../engine/rendering/SvgRenderer";
import HUDOverlay from "../components/HUDOverlay";
import PauseMenu from "../components/PauseMenu";
import GameOverScreen from "../components/GameOverScreen";
import VictoryScreen from "../components/VictoryScreen";

import { GAME_STATES } from "../../state/appState";
import { loadLevel } from "../../engine/state/store";
import { getLevelById } from "../../engine/levels";
import { getGameProgress } from "../../services/progressService";
// import { createCheckpoint } from "../../engine/state/checkpoint";

export default function GameScreen({
  initialLevelId = 1,
  startMode = "resume",
  onExitToMenu,
}) {
  const [gameState, setGameState] = useState(GAME_STATES.RUNNING);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  const dispatch = useDispatch();
  // const reduxStore = useStore();
  // const saveInFlight = useRef(false);

  const gameStatus = useSelector((state) => state.entities.gameStatus);
  const currentLevelId = useSelector((state) => state.entities.currentLevelId);

  // Load the level layout first, then restore a valid saved checkpoint.
  useEffect(() => {
    let cancelled = false;

    async function initializeGame() {
      setIsLoadingProgress(true);

      try {
        const data = await getGameProgress();

        if (cancelled) return;

        const progress = data.progress;
        // const checkpoint = progress?.checkpoint;

        const unlockedLevel = Number.isInteger(progress?.unlockedLevels)
          ? progress.unlockedLevels
          : 1;

        // Sector Select: load exactly the sector the player selected.
        if (startMode === "select") {
          if (
            !Number.isInteger(initialLevelId) ||
            initialLevelId < 1 ||
            initialLevelId > unlockedLevel ||
            initialLevelId > 3
          ) {
            dispatch(loadLevel(getLevelById(1)));
          } else {
            dispatch(loadLevel(getLevelById(initialLevelId)));
          }

          return;
        }

        // Quick Start: resume the saved checkpoint or current sector.
        const currentProgressLevel = Number.isInteger(progress?.currentLevelId)
          ? progress.currentLevelId
          : initialLevelId;

        const allowedLevel =
          currentProgressLevel >= 1 &&
          currentProgressLevel <= unlockedLevel &&
          currentProgressLevel <= 3
            ? getLevelById(currentProgressLevel)
            : getLevelById(1);

        dispatch(loadLevel(allowedLevel));

        // const checkpointIsValid =
        //   checkpoint &&
        //   Number.isInteger(checkpoint.levelId) &&
        //   checkpoint.levelId === currentProgressLevel &&
        //   checkpoint.levelId >= 1 &&
        //   checkpoint.levelId <= unlockedLevel &&
        //   checkpoint.levelId <= 3;

        // if (checkpointIsValid) {
        //   dispatch(loadLevel(getLevelById(checkpoint.levelId)));
        //   dispatch(restoreCheckpoint(checkpoint));
        // } else {
        //   const allowedLevel =
        //     currentProgressLevel >= 1 &&
        //     currentProgressLevel <= unlockedLevel &&
        //     currentProgressLevel <= 3
        //       ? getLevelById(currentProgressLevel)
        //       : getLevelById(1);

        //   dispatch(loadLevel(allowedLevel));
        // }
      } catch (error) {
        if (cancelled) return;

        // If the backend is unavailable, allow a fresh local game.
        console.error("Unable to load saved progress:", error);
        dispatch(loadLevel(getLevelById(initialLevelId)));
      } finally {
        if (!cancelled) {
          setIsLoadingProgress(false);
        }
      }
    }

    initializeGame();
  }, [dispatch, initialLevelId, startMode]);

  useEffect(() => {
    const handlePause = (event) => {
      if (event.key !== "Escape" || isLoadingProgress) return;

      setGameState((previous) =>
        previous === GAME_STATES.RUNNING
          ? GAME_STATES.PAUSED
          : GAME_STATES.RUNNING,
      );
    };

    window.addEventListener("keydown", handlePause);

    return () => {
      window.removeEventListener("keydown", handlePause);
    };
  }, [isLoadingProgress]);

  // Periodically save the live checkpoint after initial loading.
  // useEffect(() => {
  //   if (
  //     isLoadingProgress ||
  //     gameState !== GAME_STATES.RUNNING ||
  //     gameStatus !== "playing"
  //   ) {
  //     return undefined;
  //   }

  //   const saveCurrentCheckpoint = async () => {
  //     if (saveInFlight.current) return;

  //     const entities = reduxStore.getState().entities;
  //     const checkpoint = createCheckpoint(entities);

  //     if (!checkpoint) return;

  //     saveInFlight.current = true;

  //     try {
  //       await saveCheckpoint(checkpoint.levelId, checkpoint);
  //     } catch (error) {
  //       console.error("Checkpoint autosave failed:", error.message);
  //     } finally {
  //       saveInFlight.current = false;
  //     }
  //   };

  //   const intervalId = window.setInterval(() => {
  //     void saveCurrentCheckpoint();
  //   }, 10000);

  //   return () => window.clearInterval(intervalId);
  // }, [reduxStore, isLoadingProgress, gameState, gameStatus, currentLevelId]);

  const activeLevel = getLevelById(currentLevelId);

  // const restartSector = async () => {
  //   try {
  //     await clearSavedCheckpoint();
  //   } catch (error) {
  //     console.error("Failed to clear saved checkpoint:", error.message);
  //     return;
  //   }

  //   dispatch(loadLevel(activeLevel));
  //   setGameState(GAME_STATES.RUNNING);
  // };

  const restartSector = () => {
    dispatch(loadLevel(activeLevel));
    setGameState(GAME_STATES.RUNNING);
  };

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-slate-950 select-none">
      <EngineManager
        isPaused={isLoadingProgress || gameState === GAME_STATES.PAUSED}
      />

      <SvgRenderer />
      <HUDOverlay />

      <PauseMenu
        isPaused={gameState === GAME_STATES.PAUSED}
        onResume={() => setGameState(GAME_STATES.RUNNING)}
        onRestart={restartSector}
        onExit={onExitToMenu}
      />

      <GameOverScreen
        isVisible={!isLoadingProgress && gameStatus === "gameOver"}
        onRestart={restartSector}
        onExit={onExitToMenu}
      />

      <VictoryScreen
        isVisible={!isLoadingProgress && gameStatus === "victory"}
        onRestart={restartSector}
        onExit={onExitToMenu}
      />

      {isLoadingProgress && (
        <div className="absolute inset-0 z-60 flex items-center justify-center bg-slate-950 text-sky-400">
          Loading pilot progress...
        </div>
      )}
    </div>
  );
}
