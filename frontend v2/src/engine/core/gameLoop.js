import { store } from "../state/store";
import { updatePosition } from "../state/store";
import { db } from "../../services/db";

let animationFrameId = null;
let lastTime = 0;

let lastEnemyShotsFired = 0;
let lastPlayerDamageEvents = 0;
let lastEnemyDamageEvents = 0;
let lastExplosionEvents = 0;
let lastPickupCollectedEvents = 0;

let uploadMusic = null;
let isUploadMusicPlaying = false;
let isUploadMusicPaused = false;
let uploadMusicStartPending = false;
let uploadMusicRequestId = 0;
let uploadCompletionPlayed = false;

async function playSound(soundFile, count = 1) {
  try {
    const settings = await db.settings.get("guest");
    const volume = settings?.soundVolume ?? 80;

    if (volume === 0) return;

    for (let i = 0; i < count; i++) {
      const audio = new Audio(
        new URL(`../../assets/sounds/${soundFile}`, import.meta.url).href,
      );

      audio.volume = Math.max(0, Math.min(100, volume)) / 100;
      audio.play().catch(() => {});
    }
  } catch {
    // Ignore audio errors so gameplay continues normally.
  }
}

async function startUploadMusic() {
  if (uploadMusic || uploadMusicStartPending || isUploadMusicPaused) {
    return;
  }

  uploadMusicStartPending = true;
  const requestId = ++uploadMusicRequestId;

  try {
    const settings = await db.settings.get("guest");

    if (requestId !== uploadMusicRequestId || isUploadMusicPaused) {
      return;
    }

    const volume = settings?.soundVolume ?? 80;

    if (volume === 0) return;

    const audio = new Audio(
      new URL("../../assets/sounds/data-processing-2.mp3", import.meta.url)
        .href,
    );

    audio.loop = true;
    audio.volume = Math.max(0, Math.min(100, volume)) / 100;

    uploadMusic = audio;

    await audio.play();

    // Prevent an old asynchronous request from restarting stopped music.
    if (uploadMusic !== audio || isUploadMusicPaused) {
      audio.pause();
      return;
    }

    isUploadMusicPlaying = true;
  } catch (error) {
    console.error("Upload music playback failed:", error);

    if (requestId === uploadMusicRequestId) {
      if (uploadMusic) {
        uploadMusic.pause();
        uploadMusic = null;
      }

      isUploadMusicPlaying = false;
    }
  } finally {
    if (requestId === uploadMusicRequestId) {
      uploadMusicStartPending = false;
    }
  }
}

// Pause without resetting playback position.
export function pauseUploadMusic() {
  isUploadMusicPaused = true;

  if (uploadMusic) {
    uploadMusic.pause();
  }

  isUploadMusicPlaying = false;
}

// Resume from the previously paused position.
export function resumeUploadMusic() {
  isUploadMusicPaused = false;

  if (!uploadMusic || !uploadMusic.paused) return;

  const audio = uploadMusic;

  audio
    .play()
    .then(() => {
      if (uploadMusic === audio && !isUploadMusicPaused) {
        isUploadMusicPlaying = true;
      } else {
        audio.pause();
      }
    })
    .catch((error) => {
      console.error("Upload music resume failed:", error);
    });
}

// Stop completely and reset playback position.
export function stopUploadMusic() {
  uploadMusicRequestId++;
  uploadMusicStartPending = false;

  if (uploadMusic) {
    uploadMusic.pause();
    uploadMusic.currentTime = 0;
    uploadMusic = null;
  }

  isUploadMusicPlaying = false;
  isUploadMusicPaused = false;
}

export function startGameLoop() {
  stopGameLoop();
  lastTime = performance.now();

  uploadCompletionPlayed = false;

  const initialState = store.getState().entities;

  lastEnemyShotsFired = initialState.enemyShotsFired || 0;
  lastPlayerDamageEvents = initialState.playerDamageEvents || 0;
  lastEnemyDamageEvents = initialState.enemyDamageEvents || 0;
  lastExplosionEvents = initialState.explosionEvents || 0;
  lastPickupCollectedEvents = initialState.pickupCollectedEvents || 0;

  function loop(time) {
    const deltaTime = Math.min(time - lastTime, 32);
    lastTime = time;

    store.dispatch(updatePosition(deltaTime));

    const state = store.getState().entities;

    // Observatory data upload audio
    const observatory = state.observatory;
    const player = state.player;

    if (observatory && player && !observatory.activated) {
      const obsCenterX = observatory.x + (observatory.width || 90) / 2;

      const obsCenterY = observatory.y + (observatory.height || 90) / 2;

      const playerCenterX = player.x + 20;
      const playerCenterY = player.y + 20;

      const distance = Math.hypot(
        playerCenterX - obsCenterX,
        playerCenterY - obsCenterY,
      );

      const isInsideRadius = distance <= 110;

      if (isInsideRadius) {
        startUploadMusic();
      } else {
        // Leaving the radius stops and resets the track immediately.
        stopUploadMusic();
      }

      uploadCompletionPlayed = false;
    } else {
      stopUploadMusic();

      if (observatory?.activated && !uploadCompletionPlayed) {
        playSound("blip.mp3");
        uploadCompletionPlayed = true;
      }
    }

    // Enemy shooting sound
    const currentEnemyShotsFired = state.enemyShotsFired || 0;

    if (currentEnemyShotsFired > lastEnemyShotsFired) {
      playSound(
        "enemy-shoot.mp3",
        currentEnemyShotsFired - lastEnemyShotsFired,
      );
    }

    lastEnemyShotsFired = currentEnemyShotsFired;

    // Player damage sound
    const currentPlayerDamageEvents = state.playerDamageEvents || 0;

    if (currentPlayerDamageEvents > lastPlayerDamageEvents) {
      playSound(
        "got-hit.mp3",
        currentPlayerDamageEvents - lastPlayerDamageEvents,
      );
    }

    lastPlayerDamageEvents = currentPlayerDamageEvents;

    // Enemy damage sound
    const currentEnemyDamageEvents = state.enemyDamageEvents || 0;

    if (currentEnemyDamageEvents > lastEnemyDamageEvents) {
      playSound(
        "got-hit.mp3",
        currentEnemyDamageEvents - lastEnemyDamageEvents,
      );
    }

    lastEnemyDamageEvents = currentEnemyDamageEvents;

    // Enemy and player explosion sound
    const currentExplosionEvents = state.explosionEvents || 0;

    if (currentExplosionEvents > lastExplosionEvents) {
      playSound("explosion.mp3", currentExplosionEvents - lastExplosionEvents);
    }

    lastExplosionEvents = currentExplosionEvents;

    // Pickup collection sound
    const currentPickupCollectedEvents = state.pickupCollectedEvents || 0;

    if (currentPickupCollectedEvents > lastPickupCollectedEvents) {
      playSound(
        "item-pickup-2.wav",
        currentPickupCollectedEvents - lastPickupCollectedEvents,
      );
    }

    lastPickupCollectedEvents = currentPickupCollectedEvents;

    animationFrameId = requestAnimationFrame(loop);
  }

  animationFrameId = requestAnimationFrame(loop);
}

export function stopGameLoop() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  stopUploadMusic();
}
