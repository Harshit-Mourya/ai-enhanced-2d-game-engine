let lastTime = 0;
let isRunning = false;

export function startGameLoop(update) {
  isRunning = true;

  function loop(time) {
    if (!isRunning) return;

    const deltaTime = time - lastTime;
    lastTime = time;

    update(deltaTime);
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

export function stopGameLoop() {
  isRunning = false;
}
