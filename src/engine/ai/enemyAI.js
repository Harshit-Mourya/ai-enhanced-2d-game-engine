export function updateEnemyAI(state, deltaTime) {
  state.enemies.forEach((enemy) => {
    const dx = state.player.x - enemy.x;
    const dy = state.player.y - enemy.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    // FSM state switching

    if (distance < 150) {
      enemy.state = "chase";
    } else {
      enemy.state = "patrol";
    }

    // FSM execution

    if (enemy.state === "chase") {
      enemy.x += (dx / distance) * enemy.speed * (deltaTime / 16);

      enemy.y += (dy / distance) * enemy.speed * (deltaTime / 16);
    }

    if (enemy.state === "patrol") {
      enemy.x += enemy.speed * enemy.direction * (deltaTime / 16);

      if (enemy.x < 0) {
        enemy.x = 0;
        enemy.direction *= -1;
      }

      if (enemy.x > 570) {
        enemy.x = 570;
        enemy.direction *= -1;
      }
    }
  });
}
