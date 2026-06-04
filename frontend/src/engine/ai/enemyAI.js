export function updateEnemyAI(state, deltaTime) {
  state.enemies.forEach((enemy) => {
    const dx = state.player.x - enemy.x;
    const dy = state.player.y - enemy.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    // ===============================
    // STATE SWITCHING
    // ===============================

    if (distance < enemy.detectionRadius) {
      enemy.state = "attack";
    } else {
      enemy.state = "patrol";
    }

    // ===============================
    // PATROL
    // ===============================

    if (enemy.state === "patrol") {
      if (!enemy.patrolDirectionX) {
        enemy.patrolDirectionX = Math.random() * 2 - 1;
        enemy.patrolDirectionY = Math.random() * 2 - 1;
      }

      enemy.x += enemy.patrolDirectionX * enemy.speed * 0.5;
      enemy.y += enemy.patrolDirectionY * enemy.speed * 0.5;

      if (enemy.x < 0 || enemy.x > 2569) {
        enemy.patrolDirectionX *= -1;
      }

      if (enemy.y < 0 || enemy.y > 1929) {
        enemy.patrolDirectionY *= -1;
      }
    }

    // ===============================
    // DETECT
    // ===============================

    if (enemy.state === "detect") {
      // For now just look at player
      // No chasing
    }

    // ===============================
    // ATTACK
    // ===============================

    if (enemy.state === "attack") {
      if (!enemy.lastAttackTime) {
        enemy.lastAttackTime = 0;
      }

      const attackInterval = enemy.attackCooldown || 1000;

      if (Date.now() - enemy.lastAttackTime > attackInterval) {
        const enemyCenterX = enemy.x + 20;
        const enemyCenterY = enemy.y + 20;

        const playerCenterX = state.player.x + 20;
        const playerCenterY = state.player.y + 20;

        const dx = playerCenterX - enemyCenterX;
        const dy = playerCenterY - enemyCenterY;

        const length = Math.sqrt(dx * dx + dy * dy);

        if (length > 0) {
          state.projectiles.push({
            x: enemyCenterX,
            y: enemyCenterY,

            dx: dx / length,
            dy: dy / length,

            speed: enemy.projectileSpeed,

            damage: enemy.projectileDamage,

            owner: "enemy",

            projectileType: enemy.projectileType,
          });
        }

        enemy.lastAttackTime = Date.now();
      }
    }
  });
}
