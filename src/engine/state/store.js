import { configureStore, createSlice } from "@reduxjs/toolkit";

// Entity slice
const entitySlice = createSlice({
  name: "entities",
  initialState: {
    player: {
      x: 50,
      y: 50,
      dx: 0,
      dy: 0,
      speed: 2,
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
    updatePosition: (state) => {
      state.player.x += state.player.speed * state.player.dx;
      state.player.y += state.player.speed * state.player.dy;

      // boundaries (SVG: 600x400, player: 30x30)

      if (state.player.x < 0) state.player.x = 0;
      if (state.player.x > 570) state.player.x = 570;

      if (state.player.y < 0) state.player.y = 0;
      if (state.player.y > 370) state.player.y = 370;
    },
  },
});

// Export actions
export const { setDirection, updatePosition } = entitySlice.actions;

// Create store
export const store = configureStore({
  reducer: {
    entities: entitySlice.reducer,
  },
});
