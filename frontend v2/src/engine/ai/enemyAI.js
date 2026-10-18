import { findPathAStar } from "./pathfinding";
import { hasLineOfSight } from "../physics/lineOfSight";

export function isEntityInSafeZone(entity, safeZones) {
  if (!safeZones || safeZones.length === 0) return false;
  const entityCenterX = entity.x + 20;
  const entityCenterY = entity.y + 20;

  return safeZones.some((zone) => {
    if (zone.radius) {
      const dx = entityCenterX - zone.x;
      const dy = entityCenterY - zone.y;
      return dx * dx + dy * dy <= zone.radius * zone.radius;
    } else if (zone.width && zone.height) {
      return (
        entityCenterX >= zone.x &&
        entityCenterX <= zone.x + zone.width &&
        entityCenterY >= zone.y &&
        entityCenterY <= zone.y + zone.height
      );
    }
    return false;
  });
}

export function updateEnemyAI(state) {
  const playerInSafeZone = isEntityInSafeZone(state.player, state.safeZones);

  state.enemies.forEach((enemy) => {
    // Save initial spawn location as guard post
    if (enemy.guardX === undefined) enemy.guardX = enemy.x;
    if (enemy.guardY === undefined) enemy.guardY = enemy.y;

    const enemyCenterX = enemy.x + 20;
    const enemyCenterY = enemy.y + 20;
    const playerCenterX = state.player.x + 20;
    const playerCenterY = state.player.y + 20;

    const dx = playerCenterX - enemyCenterX;
    const dy = playerCenterY - enemyCenterY;
    const distance = Math.hypot(dx, dy);

    // LINE OF SIGHT CHECK (Walls block vision completely)
    const hasLOS = hasLineOfSight(
      enemyCenterX,
      enemyCenterY,
      playerCenterX,
      playerCenterY,
      state.walls
    );

    enemy.hasLineOfSight = hasLOS;

    const detectionRange = enemy.detectionRadius || 260;
    const attackRange = enemy.attackRadius || 180;

    // ===============================
    // FSM STATE TRANSITIONS WITH LOS
    // ===============================
    if (playerInSafeZone || !hasLOS || distance > detectionRange) {
      // Player hidden behind wall, in safe zone, or out of detection radius
      if (enemy.state === "chase" || enemy.state === "attack") {
        enemy.state = "return";
      }
    } else {
      // Player visible with clear line of sight
      if (distance <= attackRange) {
        enemy.state = "attack";
      } else {
        enemy.state = "chase";
      }
    }

    // ===============================
    // IDLE / RETURN TO GUARD POST
    // ===============================
    if (enemy.state === "idle" || enemy.state === "return" || enemy.state === "patrol") {
      const distToGuard = Math.hypot(enemy.guardX - enemy.x, enemy.guardY - enemy.y);

      if (distToGuard > 15) {
        const guardDx = enemy.guardX - enemy.x;
        const guardDy = enemy.guardY - enemy.y;
        const returnSpeed = (enemy.speed || 1.5) * 0.8;
        enemy.x += (guardDx / distToGuard) * returnSpeed;
        enemy.y += (guardDy / distToGuard) * returnSpeed;
      } else {
        enemy.state = "idle";
      }
    }

    // ===============================
    // CHASE STATE (Pathfinding towards Player)
    // ===============================
    else if (enemy.state === "chase") {
      if (!enemy.path || enemy.pathIndex === undefined || Date.now() - (enemy.lastPathCalc || 0) > 500) {
        enemy.path = findPathAStar(enemy.x, enemy.y, state.player.x, state.player.y, state.walls);
        enemy.pathIndex = 0;
        enemy.lastPathCalc = Date.now();
      }

      if (enemy.path && enemy.path.length > 0 && enemy.pathIndex < enemy.path.length) {
        const targetNode = enemy.path[enemy.pathIndex];
        const tDx = targetNode.x - enemy.x;
        const tDy = targetNode.y - enemy.y;
        const tDist = Math.hypot(tDx, tDy);

        if (tDist < 12) {
          enemy.pathIndex++;
        } else {
          const chaseSpeed = enemy.speed || 1.8;
          enemy.x += (tDx / tDist) * chaseSpeed;
          enemy.y += (tDy / tDist) * chaseSpeed;
        }
      } else if (distance > 0) {
        const chaseSpeed = enemy.speed || 1.8;
        enemy.x += (dx / distance) * chaseSpeed;
        enemy.y += (dy / distance) * chaseSpeed;
      }
    }

    // ===============================
    // ATTACK STATE (Fires Projectiles Only)
    // ===============================
    else if (enemy.state === "attack") {
      // Maintain tactical distance while firing
      if (distance > 80) {
        const moveSpeed = (enemy.speed || 1.5) * 0.4;
        enemy.x += (dx / distance) * moveSpeed;
        enemy.y += (dy / distance) * moveSpeed;
      }

      const now = Date.now();
      const attackInterval = enemy.attackCooldown || 900;

      if (!enemy.lastAttackTime || now - enemy.lastAttackTime > attackInterval) {
        if (distance > 0 && hasLOS) {
          state.projectiles.push({
            x: enemyCenterX,
            y: enemyCenterY,
            dx: dx / distance,
            dy: dy / distance,
            speed: enemy.projectileSpeed || 4.5,
            damage: enemy.projectileDamage || enemy.attackDamage || 8,
            owner: "enemy",
            projectileType: enemy.projectileType || "meteor",
          });
        }
        enemy.lastAttackTime = now;
      }
    }
  });
}
