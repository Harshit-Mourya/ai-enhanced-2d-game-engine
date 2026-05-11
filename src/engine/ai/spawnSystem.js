export function spawnEnemyWave(state) {
  const difficulty = state.difficultyLevel;

  const baseSpawnPoints = [
    { x: 40, y: 40 },
    { x: 560, y: 40 },
    { x: 40, y: 360 },
    { x: 560, y: 360 },
  ];

  if (!state.lastSpawnTime) {
    state.lastSpawnTime = Date.now();
  }

  const now = Date.now();

  let spawnInterval = 10000; // default 10 sec

  if (difficulty === "medium") spawnInterval = 7000;

  if (difficulty === "hard") spawnInterval = 5000;

  if (now - state.lastSpawnTime < spawnInterval) {
    return;
  }

  // ===============================
  // DETERMINE HOW MANY ENEMIES TO SPAWN
  // ===============================

  const survivalTime = state.survivalTime;

  let spawnCount = 1;

  if (survivalTime > 20) spawnCount = 2;

  if (survivalTime > 40) spawnCount = 3;

  if (survivalTime > 60) spawnCount = 4;

  // ===============================
  // SPAWN ENEMIES
  // ===============================

  for (let i = 0; i < spawnCount; i++) {
    const spawnPoint =
      baseSpawnPoints[Math.floor(Math.random() * baseSpawnPoints.length)];

    state.enemies.push(
      createEnemyByDifficulty(spawnPoint.x, spawnPoint.y, difficulty),
    );
  }

  state.lastSpawnTime = now;
}

function createEnemyByDifficulty(x, y, difficulty) {
  if (difficulty === "hard") {
    return createTankEnemy(x, y);
  }

  if (difficulty === "medium") {
    return Math.random() > 0.5
      ? createHunterEnemy(x, y)
      : createScoutEnemy(x, y);
  }

  return createScoutEnemy(x, y);
}

function createScoutEnemy(x, y) {
  return {
    id: crypto.randomUUID(),

    type: "enemy",

    enemyClass: "scout",

    x,
    y,

    speed: 2.2,

    detectionRadius: 170,

    attackRadius: 35,

    attackDamage: 1,

    attackCooldown: 900,

    state: "patrol",

    lastAttackTime: 0,
  };
}

function createHunterEnemy(x, y) {
  return {
    id: crypto.randomUUID(),

    type: "enemy",

    enemyClass: "hunter",

    x,
    y,

    speed: 1.6,

    detectionRadius: 150,

    attackRadius: 40,

    attackDamage: 2,

    attackCooldown: 800,

    state: "patrol",

    lastAttackTime: 0,
  };
}

function createTankEnemy(x, y) {
  return {
    id: crypto.randomUUID(),

    type: "enemy",

    enemyClass: "tank",

    x,
    y,

    speed: 1.0,

    detectionRadius: 120,

    attackRadius: 55,

    attackDamage: 4,

    attackCooldown: 1400,

    state: "patrol",

    lastAttackTime: 0,
  };
}
