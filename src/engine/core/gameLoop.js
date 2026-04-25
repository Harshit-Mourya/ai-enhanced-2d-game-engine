// src/engine/core/gameLoop.js

import { store } from "../state/store";
import { updatePosition } from "../state/store";

let lastTime = 0;
let isRunning = false;

export function startGameLoop() {
  isRunning = true;

  function loop(time) {
    if (!isRunning) return;

    const deltaTime = time - lastTime;
    lastTime = time;

    // engine update step
    store.dispatch(updatePosition(deltaTime));

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

export function stopGameLoop() {
  isRunning = false;
}
