import { configureStore, createSlice } from "@reduxjs/toolkit";

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
      collided: false,
    },

    enemy: {
      x: 0,
      y: 0,
      direction: 1,
      speed: 1.5,
      collided: false,
    },
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

      // ENEMY AUTO MOVEMENT (left ↔ right)

      state.enemy.x +=
        state.enemy.speed * state.enemy.direction * (deltaTime / 16);

      // boundary clamp + direction flip

      if (state.enemy.x < 0) {
        state.enemy.x = 0;
        state.enemy.direction *= -1;
      }

      if (state.enemy.x > 570) {
        state.enemy.x = 570;
        state.enemy.direction *= -1;
      }

      // PLAYER–ENEMY COLLISION DETECTION

      const playerRight = state.player.x + 30;
      const playerBottom = state.player.y + 30;

      const enemyRight = state.enemy.x + 30;
      const enemyBottom = state.enemy.y + 30;

      const collision =
        state.player.x < enemyRight &&
        playerRight > state.enemy.x &&
        state.player.y < enemyBottom &&
        playerBottom > state.enemy.y;

      if (collision) {
        state.player.collided = collision;
        state.enemy.collided = collision;
      }
    },
    loadLevel: (state, action) => {
      const level = action.payload;

      state.player.x = level.player.x;
      state.player.y = level.player.y;
      state.player.speed = level.player.speed;

      state.enemy.x = level.enemy.x;
      state.enemy.y = level.enemy.y;
      state.enemy.speed = level.enemy.speed;
      state.enemy.direction = level.enemy.direction;
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
