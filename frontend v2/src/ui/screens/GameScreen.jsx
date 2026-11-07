import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch, useStore } from "react-redux";

import EngineManager from "../../game/EngineManager";
import SvgRenderer from "../../engine/rendering/SvgRenderer";
import HUDOverlay from "../components/HUDOverlay";
import PauseMenu from "../components/PauseMenu";
import GameOverScreen from "../components/GameOverScreen";
import VictoryScreen from "../components/VictoryScreen";
import {
  pauseUploadMusic,
  resumeUploadMusic,
  stopGameLoop,
  stopUploadMusic,
} from "../../engine/core/gameLoop";
import { GAME_STATES } from "../../state/appState";
import { loadLevel, setDirection } from "../../engine/state/store";
import { getLevelById } from "../../engine/levels";
import { getGameProgress } from "../../services/progressService";
import bgMusic from "../../assets/sounds/bg-music-2.mp3";
import portalSound from "../../assets/sounds/portal-sound.mp3";
import winSound from "../../assets/sounds/win.mp3";
import gameOverSound from "../../assets/sounds/game-over.mp3";
import { getOrCreateUserData } from "../../services/db";

export default function GameScreen({
  initialLevelId = 1,
  startMode = "resume",
  onExitToMenu,
}) {
  const [gameState, setGameState] = useState(GAME_STATES.RUNNING);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  const [musicVolume, setMusicVolume] = useState(70);
  const audioRef = useRef(null);
  const winSoundPlayed = useRef(false);
  const gameOverSoundPlayed = useRef(false);

  const [portalAnimation, setPortalAnimation] = useState(null);
  const [hasVictoryAnimationCompleted, setHasVictoryAnimationCompleted] =
    useState(false);

  const dispatch = useDispatch();

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
      } catch (error) {
        if (cancelled) return;

        // If the backend is unavailable, allow a fresh local game.
        console.error("Unable to load saved progress:", error);
        dispatch(loadLevel(getLevelById(initialLevelId)));
      } finally {
        if (!cancelled) {
          setIsLoadingProgress(false);
          setPortalAnimation("arrival");
          setHasVictoryAnimationCompleted(false);
        }
      }
    }

    initializeGame();
  }, [dispatch, initialLevelId, startMode]);

  // Start portal departure when the player reaches the exit.
  useEffect(() => {
    if (
      isLoadingProgress ||
      gameStatus !== "victory" ||
      portalAnimation === "departure" ||
      hasVictoryAnimationCompleted
    ) {
      return;
    }

    setPortalAnimation("departure");
  }, [
    isLoadingProgress,
    gameStatus,
    portalAnimation,
    hasVictoryAnimationCompleted,
  ]);

  // Complete the portal animation after one second.
  useEffect(() => {
    if (!portalAnimation) return;

    const animationTimer = window.setTimeout(() => {
      if (portalAnimation === "departure") {
        setHasVictoryAnimationCompleted(true);
      }

      setPortalAnimation(null);
    }, 1500);

    return () => window.clearTimeout(animationTimer);
  }, [portalAnimation]);

  // Play victory sound after portal departure animation completes.
  useEffect(() => {
    if (
      gameStatus !== "victory" ||
      !hasVictoryAnimationCompleted ||
      winSoundPlayed.current
    ) {
      return;
    }

    let cancelled = false;
    let audio = null;

    async function playWinSound() {
      try {
        const data = await getOrCreateUserData("guest");

        if (cancelled) return;

        const volume = data.settings?.soundVolume ?? 80;

        if (volume === 0) return;

        audio = new Audio(winSound);
        audio.volume = Math.max(0, Math.min(100, volume)) / 100;

        await audio.play();

        winSoundPlayed.current = true;
      } catch (error) {
        console.error("Victory sound playback failed:", error);
      }
    }

    playWinSound();

    return () => {
      cancelled = true;
    };
  }, [gameStatus, hasVictoryAnimationCompleted]);

  // Play game-over sound once when the player is defeated.
  useEffect(() => {
    if (gameStatus !== "gameOver" || gameOverSoundPlayed.current) {
      return;
    }

    let cancelled = false;
    let audio = null;

    async function playGameOverSound() {
      try {
        const data = await getOrCreateUserData("guest");

        if (cancelled) return;

        const volume = data.settings?.soundVolume ?? 80;

        if (volume === 0) {
          gameOverSoundPlayed.current = true;
          return;
        }

        audio = new Audio(gameOverSound);
        audio.volume = Math.max(0, Math.min(100, volume)) / 100;

        await audio.play();

        if (cancelled) {
          audio.pause();
          audio.currentTime = 0;
          return;
        }

        gameOverSoundPlayed.current = true;
      } catch (error) {
        console.error("Game-over sound playback failed:", error);
      }
    }

    playGameOverSound();

    return () => {
      cancelled = true;
    };
  }, [gameStatus]);

  // Play portal sound for both arrival and departure.
  useEffect(() => {
    if (!portalAnimation) return;

    let cancelled = false;
    let audio = null;

    async function playPortalSound() {
      try {
        const data = await getOrCreateUserData("guest");

        if (cancelled) return;

        const volume = data.settings?.soundVolume ?? 80;

        if (volume === 0) return;

        audio = new Audio(portalSound);
        audio.volume = Math.max(0, Math.min(100, volume)) / 100;

        audio.play().catch(() => {
          console.error("Portal sound playback failed:", error);
        });
      } catch (error) {
        console.error("Unable to play portal sound:", error);
      }
    }

    playPortalSound();

    return () => {
      cancelled = true;

      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [portalAnimation]);

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

  // Manage Observatory upload music during pause, resume and game exit.
  useEffect(() => {
    if (gameState === GAME_STATES.PAUSED) {
      pauseUploadMusic();
      return;
    }

    if (
      isLoadingProgress ||
      gameStatus !== "playing" ||
      portalAnimation !== null
    ) {
      stopUploadMusic();
      return;
    }

    resumeUploadMusic();
  }, [gameState, isLoadingProgress, gameStatus, portalAnimation]);

  // Stop the game loop and upload music when leaving GameScreen.
  useEffect(() => {
    return () => {
      stopGameLoop();
    };
  }, []);

  const activeLevel = getLevelById(currentLevelId);

  const restartSector = () => {
    winSoundPlayed.current = false;
    gameOverSoundPlayed.current = false;
    setHasVictoryAnimationCompleted(false);
    setPortalAnimation("arrival");

    dispatch(loadLevel(activeLevel));
    setGameState(GAME_STATES.RUNNING);
  };

  useEffect(() => {
    let cancelled = false;

    async function loadAudioSettings() {
      try {
        const data = await getOrCreateUserData("guest");

        if (!cancelled) {
          setMusicVolume(data.settings?.musicVolume ?? 70);
        }
      } catch (error) {
        console.error("Unable to load audio settings:", error);
      }
    }

    loadAudioSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const audio = new Audio(bgMusic);

    audio.loop = true;
    audio.volume = 0.7;

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const isGameActive =
      !isLoadingProgress &&
      gameState === GAME_STATES.RUNNING &&
      gameStatus === "playing" &&
      portalAnimation === null;

    audio.volume = Math.max(0, Math.min(100, musicVolume)) / 100;

    if (!isGameActive || musicVolume === 0) {
      audio.pause();
      return;
    }

    let cancelled = false;

    const tryPlayMusic = () => {
      if (cancelled || audioRef.current !== audio) return;

      audio.play().catch(() => {
        // Browser may require a user interaction before playback.
        console.error("BGM playback failed:", error);
      });
    };

    tryPlayMusic();

    window.addEventListener("keydown", tryPlayMusic);
    window.addEventListener("pointerdown", tryPlayMusic);

    return () => {
      cancelled = true;
      window.removeEventListener("keydown", tryPlayMusic);
      window.removeEventListener("pointerdown", tryPlayMusic);
      audio.pause();
    };
  }, [isLoadingProgress, gameState, gameStatus, musicVolume, portalAnimation]);

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-slate-950 select-none">
      <EngineManager
        isPaused={
          isLoadingProgress ||
          gameState === GAME_STATES.PAUSED ||
          portalAnimation !== null
        }
      />
      <SvgRenderer portalAnimation={portalAnimation} /> <HUDOverlay />
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
        isVisible={
          !isLoadingProgress &&
          gameStatus === "victory" &&
          hasVictoryAnimationCompleted
        }
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
