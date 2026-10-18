export function createCheckpoint(entities) {
  if (!entities || entities.gameStatus !== "playing") {
    return null;
  }

  return {
    levelId: entities.currentLevelId,

    player: {
      x: entities.player.x,
      y: entities.player.y,
      rotation: entities.player.rotation,
      speed: entities.player.speed,
      health: entities.player.health,
      maxHealth: entities.player.maxHealth,
      projectileSpeed: entities.player.projectileSpeed,
      projectileDamage: entities.player.projectileDamage,
      projectileType: entities.player.projectileType,
    },

    score: entities.score,
    survivalTime: entities.survivalTime,
    enemiesKilled: entities.enemiesKilled,
    artifactsCollected: entities.artifactsCollected,
    takenDamage: entities.takenDamage,

    enemies: entities.enemies.map((enemy) => ({ ...enemy })),
    pickups: entities.pickups.map((pickup) => ({ ...pickup })),

    observatory: entities.observatory ? { ...entities.observatory } : null,

    exitGate: entities.exitGate ? { ...entities.exitGate } : null,
  };
}
