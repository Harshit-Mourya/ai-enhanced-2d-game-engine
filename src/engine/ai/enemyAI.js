export function updateEnemyAI(state, deltaTime) {
  const dx = state.player.x - state.enemy.x;
  const dy = state.player.y - state.enemy.y;

  const distance = Math.sqrt(dx * dx + dy * dy);

  // STATE SWITCHING

  if (distance < 150) {
    state.enemy.state = "chase";
  } else {
    state.enemy.state = "patrol";
  }

  // STATE EXECUTION

  if (state.enemy.state === "chase") {
    state.enemy.x += (dx / distance) * state.enemy.speed * (deltaTime / 16);
    state.enemy.y += (dy / distance) * state.enemy.speed * (deltaTime / 16);
  }

  if (state.enemy.state === "patrol") {
    state.enemy.x +=
      state.enemy.speed * state.enemy.direction * (deltaTime / 16);

    if (state.enemy.x < 0) {
      state.enemy.x = 0;
      state.enemy.direction *= -1;
    }

    if (state.enemy.x > 570) {
      state.enemy.x = 570;
      state.enemy.direction *= -1;
    }
  }
}
