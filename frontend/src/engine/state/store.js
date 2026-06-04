import { configureStore, createSlice } from "@reduxjs/toolkit";
import { updateEnemyAI } from "../ai/enemyAI";
// import { spawnEnemyWave } from "../ai/spawnSystem";
import { resolveWallCollision } from "../physics/wallCollision";
// Entity slice
const entitySlice = createSlice({
  name: "entities",

  initialState: {
    gameStatus: "playing",

    survivalTime: 0,

    difficultyLevel: "normal",

    lastSpawnTime: 0,

    safeZones: [],
    walls: [],

    player: {
      x: 0,
      y: 0,

      dx: 0,
      dy: 0,

      speed: 2,

      health: 100,

      projectileSpeed: 3,
      projectileDamage: 1,
      projectileType: "comet",

      collided: false,
    },

    enemies: [],
    exitGate: null,
    mouse: {
      x: 0,
      y: 0,
    },
    projectiles: [],
  },

  reducers: {
    // PLAYER INPUT DIRECTION
    setDirection: (state, action) => {
      if (action.payload.dx !== undefined) state.player.dx = action.payload.dx;

      if (action.payload.dy !== undefined) state.player.dy = action.payload.dy;
    },

    // MAIN GAME UPDATE STEP (runs every engine tick)
    updatePosition: (state, action) => {
      if (state.gameStatus === "gameOver" || state.gameStatus === "victory")
        return;
      // ===============================
      // SURVIVAL TIMER + DIFFICULTY
      // ===============================

      state.survivalTime += action.payload / 1000;

      if (state.survivalTime > 60) state.difficultyLevel = "hard";
      else if (state.survivalTime > 30) state.difficultyLevel = "medium";
      else state.difficultyLevel = "normal";

      // ===============================
      // PLAYER MOVEMENT
      // ===============================

      state.player.x += state.player.speed * state.player.dx;

      state.player.y += state.player.speed * state.player.dy;

      resolveWallCollision(state.player, state.walls);

      // ===============================
      // WORLD BOUNDARIES
      // ===============================

      // if (state.player.x < 0) state.player.x = 0;

      // if (state.player.x > 970) state.player.x = 970;

      // if (state.player.y < 0) state.player.y = 0;

      // if (state.player.y > 670) state.player.y = 670;

      // ===============================
      // ENEMY AI UPDATE
      // ===============================

      updateEnemyAI(state, action.payload);
      state.enemies.forEach((enemy) => {
        resolveWallCollision(enemy, state.walls);
      });

      // ===============================
      // SPAWN SYSTEM UPDATE
      // ===============================

      // spawnEnemyWave(state);

      // ===============================
      // PROJECTILE MOVEMENT + COLLISION
      // ===============================

      state.projectiles = state.projectiles.filter((projectile) => {
        projectile.x += projectile.dx * projectile.speed;

        projectile.y += projectile.dy * projectile.speed;

        // ===============================
        // REMOVE IF OUTSIDE WORLD
        // ===============================

        if (
          projectile.x < 0 ||
          projectile.x > 2569 ||
          projectile.y < 0 ||
          projectile.y > 1929
        ) {
          return false;
        }

        // ===============================
        // WALL COLLISION
        // ===============================

        const hitWall = state.walls.some((wall) => {
          return (
            projectile.x < wall.x + wall.width &&
            projectile.x + 5 > wall.x &&
            projectile.y < wall.y + wall.height &&
            projectile.y + 5 > wall.y
          );
        });

        if (hitWall) {
          return false;
        }

        // ===============================
        // ENEMY COLLISION
        // ===============================

        // ===============================
        // ENEMY PROJECTILE -> PLAYER
        // ===============================

        if (projectile.owner === "enemy") {
          const collision =
            projectile.x < state.player.x + 40 &&
            projectile.x + 5 > state.player.x &&
            projectile.y < state.player.y + 40 &&
            projectile.y + 5 > state.player.y;

          if (collision) {
            state.player.health -= projectile.damage;

            return false;
          }

          return true;
        }

        // ===============================
        // PLAYER PROJECTILE -> ENEMY
        // ===============================

        let hitEnemy = false;

        state.enemies.forEach((enemy) => {
          const collision =
            projectile.x < enemy.x + 40 &&
            projectile.x + 5 > enemy.x &&
            projectile.y < enemy.y + 40 &&
            projectile.y + 5 > enemy.y;

          if (collision) {
            enemy.health -= projectile.damage;

            hitEnemy = true;
          }
        });

        if (hitEnemy) {
          return false;
        }

        return true;
      });

      // ===============================
      // REMOVE DEAD ENEMIES
      // ===============================

      state.enemies = state.enemies.filter((enemy) => enemy.health > 0);

      // ===============================
      // COLLISION CHECK (PLAYER vs ENEMY)
      // ===============================

      // state.player.collided = false;

      // state.enemies.forEach((enemy) => {
      //   const playerRight = state.player.x + 30;
      //   const playerBottom = state.player.y + 30;

      //   const enemyRight = enemy.x + 30;
      //   const enemyBottom = enemy.y + 30;

      //   const collision =
      //     state.player.x < enemyRight &&
      //     playerRight > enemy.x &&
      //     state.player.y < enemyBottom &&
      //     playerBottom > enemy.y;

      //   enemy.collided = collision;

      //   if (collision) state.player.collided = true;
      // });

      // ===============================
      // EXIT GATE COLLISION
      // ===============================

      if (state.exitGate) {
        const gateRight = state.exitGate.x + state.exitGate.width;

        const gateBottom = state.exitGate.y + state.exitGate.height;

        const playerRight = state.player.x + 30;

        const playerBottom = state.player.y + 30;

        const reachedExit =
          state.player.x < gateRight &&
          playerRight > state.exitGate.x &&
          state.player.y < gateBottom &&
          playerBottom > state.exitGate.y;

        if (reachedExit) {
          state.gameStatus = "victory";
        }
      }

      // ===============================
      // GAME OVER CONDITION
      // ===============================

      if (state.player.health <= 0) {
        state.player.health = 0;

        state.gameStatus = "gameOver";
      }
    },

    // LOAD / RESET LEVEL STATE
    loadLevel: (state, action) => {
      const level = action.payload;

      // ===============================
      // RESET CORE GAME STATE
      // ===============================

      state.gameStatus = "playing";

      state.survivalTime = 0;

      state.lastSpawnTime = 0;

      state.difficultyLevel = "normal";

      // ===============================
      // LOAD SAFE ZONES
      // ===============================

      state.safeZones = level.safeZones || [];
      state.walls = level.walls || [];
      state.exitGate = level.exitGate || null;

      // ===============================
      // RESET PLAYER
      // ===============================

      state.player.x = level.player.x;

      state.player.y = level.player.y;

      state.player.speed = level.player.speed;

      state.player.health = level.player.health || 100;

      state.player.projectileSpeed = level.player.projectileSpeed || 3;

      state.player.projectileDamage = level.player.projectileDamage || 1;

      state.player.projectileType = level.player.projectileType || "comet";
      state.player.dx = 0;

      state.player.dy = 0;

      state.player.health = 100;

      state.player.collided = false;

      // ===============================
      // RESET ENEMIES
      // ===============================

      state.enemies = level.enemies.map((enemy) => ({
        id: crypto.randomUUID(),

        ...enemy,

        health: enemy.health || 5,
        maxHealth: enemy.health || 5,

        collided: false,

        state: "patrol",

        lastAttackTime: 0,
      }));
    },

    // MANUAL GAME STATUS CONTROL
    setGameStatus: (state, action) => {
      state.gameStatus = action.payload;
    },
    setMousePosition: (state, action) => {
      state.mouse.x = action.payload.x;

      state.mouse.y = action.payload.y;
    },
    spawnProjectile: (state, action) => {
      state.projectiles.push(action.payload);
    },
  },
});

// EXPORT ACTIONS

export const {
  setDirection,

  updatePosition,

  loadLevel,

  setGameStatus,
  setMousePosition,
  spawnProjectile,
} = entitySlice.actions;

// CREATE STORE

export const store = configureStore({
  reducer: {
    entities: entitySlice.reducer,
  },
});
