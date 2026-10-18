import { store } from "../state/store";
import { updatePosition } from "../state/store";

let animationFrameId = null;
let lastTime = 0;

export function startGameLoop() {
  stopGameLoop(); // ensure no duplicate loops
  lastTime = performance.now();

  function loop(time) {
    const deltaTime = Math.min(time - lastTime, 32); // clamp max frame gap

    lastTime = time;

    store.dispatch(updatePosition(deltaTime));

    animationFrameId = requestAnimationFrame(loop);
  }

  animationFrameId = requestAnimationFrame(loop);
}

export function stopGameLoop() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);

    animationFrameId = null;
  }
}
