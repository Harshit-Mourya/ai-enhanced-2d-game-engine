export function updateEnemyAI(state, deltaTime) {
  const frameScale = deltaTime / 16.67;

  state.enemies.forEach((enemy) => {
    const dx = state.player.x - enemy.x;
    const dy = state.player.y - enemy.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    // FSM STATE SWITCHING

    if (distance < 40) {
      enemy.state = "attack";
    } else if (distance < 150) {
      enemy.state = "chase";
    } else {
      enemy.state = "patrol";
    }

    // FSM EXECUTION

    // PATROL STATE

    if (enemy.state === "patrol") {
      enemy.x += enemy.speed * enemy.direction * frameScale;

      if (enemy.x < 0) {
        enemy.x = 0;
        enemy.direction *= -1;
      }

      if (enemy.x > 570) {
        enemy.x = 570;
        enemy.direction *= -1;
      }
    }

    // CHASE STATE

    if (enemy.state === "chase") {
      enemy.x += (dx / distance) * enemy.speed * frameScale;

      enemy.y += (dy / distance) * enemy.speed * frameScale;
    }

    // ATTACK STATE

    if (enemy.state === "attack") {
      // stop movement automatically (no position update)

      if (!enemy.lastAttackTime) {
        enemy.lastAttackTime = 0;
      }

      const attackInterval = enemy.attackCooldown || 800;

      if (Date.now() - enemy.lastAttackTime > attackInterval) {
        state.player.health -= enemy.attackDamage || 1;

        if (state.player.health < 0) {
          state.player.health = 0;
        }

        enemy.lastAttackTime = Date.now();
      }
    }
  });
}
