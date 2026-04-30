export function updateEnemyAI(state, deltaTime) {
  const difficulty = state.difficultyLevel;

  state.enemies.forEach((enemy) => {
    const dx = state.player.x - enemy.x;
    const dy = state.player.y - enemy.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    // ===============================
    // DIFFICULTY-BASED SPEED MULTIPLIER
    // ===============================

    let speedMultiplier = 1;

    if (difficulty === "medium") speedMultiplier = 1.4;
    if (difficulty === "hard") speedMultiplier = 1.8;

    // ===============================
    // FSM STATE SWITCHING
    // ===============================

    if (distance < 40) {
      enemy.state = "attack";
    } else if (distance < 150) {
      enemy.state = "chase";
    } else {
      enemy.state = "patrol";
    }

    // ===============================
    // PATROL STATE
    // ===============================

    if (enemy.state === "patrol") {
      enemy.x += enemy.speed * enemy.direction * speedMultiplier;

      if (enemy.x < 0) {
        enemy.x = 0;
        enemy.direction *= -1;
      }

      if (enemy.x > 570) {
        enemy.x = 570;
        enemy.direction *= -1;
      }
    }

    // ===============================
    // CHASE STATE
    // ===============================

    if (enemy.state === "chase") {
      if (distance > 0) {
        enemy.x += (dx / distance) * enemy.speed * speedMultiplier;
        enemy.y += (dy / distance) * enemy.speed * speedMultiplier;
      }
    }

    // ===============================
    // ATTACK STATE
    // ===============================

    if (enemy.state === "attack") {
      if (!enemy.lastAttackTime) {
        enemy.lastAttackTime = 0;
      }

      let attackInterval = enemy.attackCooldown || 800;

      // adaptive attack speed scaling

      if (difficulty === "medium") attackInterval *= 0.75;
      if (difficulty === "hard") attackInterval *= 0.5;

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
