export function updateEnemyAI(state, deltaTime) {
  const difficulty = state.difficultyLevel;

  const safeZones = state.safeZones || [];

  state.enemies.forEach((enemy) => {
    const dx = state.player.x - enemy.x;
    const dy = state.player.y - enemy.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    // ===============================
    // SAFE ZONE CHECK
    // ===============================

    let playerInSafeZone = false;

    safeZones.forEach((zone) => {
      const zx = state.player.x - zone.x;
      const zy = state.player.y - zone.y;

      const dist = Math.sqrt(zx * zx + zy * zy);

      if (dist < zone.radius) {
        playerInSafeZone = true;
      }
    });

    // ===============================
    // DIFFICULTY SPEED MULTIPLIER
    // ===============================

    let speedMultiplier = 1;

    if (difficulty === "medium") speedMultiplier = 1.4;

    if (difficulty === "hard") speedMultiplier = 1.8;

    // ===============================
    // DETECTION MULTIPLIER
    // ===============================

    let detectionMultiplier = 1;

    if (difficulty === "medium") detectionMultiplier = 1.2;

    if (difficulty === "hard") detectionMultiplier = 1.4;

    const adjustedDetectionRadius = enemy.detectionRadius * detectionMultiplier;

    // ===============================
    // FSM STATE SWITCHING
    // ===============================

    if (!playerInSafeZone && distance < enemy.attackRadius) {
      enemy.state = "attack";
    } else if (!playerInSafeZone && distance < adjustedDetectionRadius) {
      enemy.state = "chase";
    } else {
      enemy.state = "patrol";
    }

    // ===============================
    // PATROL STATE
    // ===============================

    if (enemy.state === "patrol") {
      if (!enemy.patrolDirectionX) {
        enemy.patrolDirectionX = Math.random() * 2 - 1;

        enemy.patrolDirectionY = Math.random() * 2 - 1;
      }

      enemy.x += enemy.patrolDirectionX * enemy.speed * 0.5 * speedMultiplier;

      enemy.y += enemy.patrolDirectionY * enemy.speed * 0.5 * speedMultiplier;

      if (enemy.x < 0 || enemy.x > 970) enemy.patrolDirectionX *= -1;

      if (enemy.y < 0 || enemy.y > 670) enemy.patrolDirectionY *= -1;
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
      if (playerInSafeZone) return;

      if (!enemy.lastAttackTime) {
        enemy.lastAttackTime = 0;
      }

      let attackInterval = enemy.attackCooldown || 800;

      if (difficulty === "medium") attackInterval *= 0.75;

      if (difficulty === "hard") attackInterval *= 0.5;

      if (Date.now() - enemy.lastAttackTime > attackInterval) {
        state.player.health -= enemy.attackDamage || 1;

        if (state.player.health < 0) state.player.health = 0;

        enemy.lastAttackTime = Date.now();
      }
    }
  });
}
