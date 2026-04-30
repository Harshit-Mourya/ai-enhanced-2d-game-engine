import { configureStore, createSlice } from "@reduxjs/toolkit";
import { updateEnemyAI } from "../ai/enemyAI";

// Entity slice
const entitySlice = createSlice({
  name: "entities",

  initialState: {
    gameStatus: "playing",

    survivalTime: 0,

    difficultyLevel: "normal",

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
      if (action.payload.dx !== undefined) {
        state.player.dx = action.payload.dx;
      }

      if (action.payload.dy !== undefined) {
        state.player.dy = action.payload.dy;
      }
    },

    // MAIN GAME UPDATE STEP (runs every engine tick)
    updatePosition: (state, action) => {
      if (state.gameStatus === "gameOver") return;

      // SURVIVAL TIMER + ADAPTIVE DIFFICULTY SYSTEM

      if (state.gameStatus === "playing") {
        state.survivalTime += action.payload / 1000;

        // difficulty scaling based on survival time

        if (state.survivalTime > 60) {
          state.difficultyLevel = "hard";
        } else if (state.survivalTime > 30) {
          state.difficultyLevel = "medium";
        } else {
          state.difficultyLevel = "normal";
        }
      }

      const deltaTime = action.payload;

      // PLAYER MOVEMENT (fixed timestep compatible)

      state.player.x += state.player.speed * state.player.dx;

      state.player.y += state.player.speed * state.player.dy;

      // WORLD BOUNDARIES (SVG: 600x400, player: 30x30)

      if (state.player.x < 0) state.player.x = 0;

      if (state.player.x > 570) state.player.x = 570;

      if (state.player.y < 0) state.player.y = 0;

      if (state.player.y > 370) state.player.y = 370;

      // ENEMY FSM AI UPDATE

      updateEnemyAI(state, deltaTime);

      // PLAYER vs ENEMY COLLISION CHECK (AABB)

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

        if (collision) {
          state.player.collided = true;
        }
      });

      // GAME OVER CONDITION

      if (state.player.health <= 0) {
        state.player.health = 0;

        state.gameStatus = "gameOver";
      }
    },

    // LOAD / RESET LEVEL STATE
    loadLevel: (state, action) => {
      const level = action.payload;

      // RESET CORE GAME STATE

      state.gameStatus = "playing";

      state.survivalTime = 0;

      state.difficultyLevel = "normal";

      // RESET PLAYER

      state.player.x = level.player.x;

      state.player.y = level.player.y;

      state.player.speed = level.player.speed;

      state.player.dx = 0;

      state.player.dy = 0;

      state.player.health = 100;

      state.player.collided = false;

      // RESET ENEMIES

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
