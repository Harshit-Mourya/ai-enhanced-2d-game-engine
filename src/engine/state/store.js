import { configureStore, createSlice } from "@reduxjs/toolkit";
import { updateEnemyAI } from "../ai/enemyAI";

// Entity slice
const entitySlice = createSlice({
  name: "entities",
  initialState: {
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
    setDirection: (state, action) => {
      if (action.payload.dx !== undefined) {
        state.player.dx = action.payload.dx;
      }

      if (action.payload.dy !== undefined) {
        state.player.dy = action.payload.dy;
      }
    },
    updatePosition: (state, action) => {
      const deltaTime = action.payload || 16;
      state.player.x += state.player.speed * state.player.dx * (deltaTime / 16);
      state.player.y += state.player.speed * state.player.dy * (deltaTime / 16);

      // boundaries (SVG: 600x400, player: 30x30)

      if (state.player.x < 0) state.player.x = 0;
      if (state.player.x > 570) state.player.x = 570;

      if (state.player.y < 0) state.player.y = 0;
      if (state.player.y > 370) state.player.y = 370;

      // ENEMY FSM AI
      updateEnemyAI(state, deltaTime);

      // PLAYER vs ENEMIES collision detection (AABB)

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
    },
    loadLevel: (state, action) => {
      const level = action.payload;

      // load player

      state.player.x = level.player.x;
      state.player.y = level.player.y;
      state.player.speed = level.player.speed;

      // load enemies array

      state.enemies = level.enemies.map((enemy) => ({
        ...enemy,
        collided: false,
        state: "patrol",
        lastAttackTime: 0,
      }));
    },
  },
});

// Export actions
export const { setDirection, updatePosition, loadLevel } = entitySlice.actions;

// Create store
export const store = configureStore({
  reducer: {
    entities: entitySlice.reducer,
  },
});
