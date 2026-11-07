import { spawnProjectile, store } from "../state/store";
import { db } from "../../services/db";

let shootingAudio;

export function shoot(dispatch) {
  const stateBefore = store.getState().entities;

  if (stateBefore.gameStatus !== "playing") return;

  if (stateBefore.player.inSafeZone) {
    dispatch(spawnProjectile());
    return;
  }

  const playerCenterX = stateBefore.player.x + 20;
  const playerCenterY = stateBefore.player.y + 20;

  const dx = stateBefore.mouse.worldX - playerCenterX;
  const dy = stateBefore.mouse.worldY - playerCenterY;

  if (Math.hypot(dx, dy) === 0) return;

  const projectileCount = stateBefore.projectiles.length;

  dispatch(spawnProjectile());

  const stateAfter = store.getState().entities;

  if (stateAfter.projectiles.length > projectileCount) {
    if (!shootingAudio) {
      shootingAudio = new Audio(
        new URL("../../assets/sounds/laser-shot.mp3", import.meta.url).href,
      );
    }

    // Always read the latest saved SFX volume.
    db.settings
      .get("guest")
      .then((settings) => {
        const volume = settings?.soundVolume ?? 80;

        shootingAudio.volume = Math.max(0, Math.min(100, volume)) / 100;

        if (volume === 0) return;

        shootingAudio.currentTime = 0;
        shootingAudio.play().catch(() => {});
      })
      .catch((error) => {
        console.error("Unable to load sound volume:", error);
      });
  }
}
