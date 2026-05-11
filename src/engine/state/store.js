import { configureStore, createSlice } from "@reduxjs/toolkit";
import { updateEnemyAI } from "../ai/enemyAI";
import { spawnEnemyWave } from "../ai/spawnSystem";
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
      collided: false,
    },

    enemies: [],
  },

  reducers: {
    // PLAYER INPUT DIRECTION
    setDirection: (state, action) => {
      if (action.payload.dx !== undefined) state.player.dx = action.payload.dx;

      if (action.payload.dy !== undefined) state.player.dy = action.payload.dy;
    },

    // MAIN GAME UPDATE STEP (runs every engine tick)
    updatePosition: (state, action) => {
      if (state.gameStatus === "gameOver") return;

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

      if (state.player.x < 0) state.player.x = 0;

      if (state.player.x > 970) state.player.x = 970;

      if (state.player.y < 0) state.player.y = 0;

      if (state.player.y > 670) state.player.y = 670;

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

      spawnEnemyWave(state);

      // ===============================
      // COLLISION CHECK (PLAYER vs ENEMY)
      // ===============================

      state.player.collided = false;

      state.enemies.forEach((enemy) => {
        const playerRight = state.player.x + 30;
        const playerBottom = state.player.y + 30;

        const enemyRight = enemy.x + 30;
        const enemyBottom = enemy.y + 30;

        const collision =
          state.player.x < enemyRight &&
          playerRight > enemy.x &&
          state.player.y < enemyBottom &&
          playerBottom > enemy.y;

        enemy.collided = collision;

        if (collision) state.player.collided = true;
      });

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

      // ===============================
      // RESET PLAYER
      // ===============================

      state.player.x = level.player.x;

      state.player.y = level.player.y;

      state.player.speed = level.player.speed;

      state.player.dx = 0;

      state.player.dy = 0;

      state.player.health = 100;

      state.player.collided = false;

      // ===============================
      // RESET ENEMIES
      // ===============================

      state.enemies = level.enemies.map((enemy) => ({
        ...enemy,

        collided: false,

        state: "patrol",

        lastAttackTime: 0,
      }));
    },

    // MANUAL GAME STATUS CONTROL
    setGameStatus: (state, action) => {
      state.gameStatus = action.payload;
    },
  },
});

// EXPORT ACTIONS

export const {
  setDirection,

  updatePosition,

  loadLevel,

  setGameStatus,
} = entitySlice.actions;

// CREATE STORE

export const store = configureStore({
  reducer: {
    entities: entitySlice.reducer,
  },
});
