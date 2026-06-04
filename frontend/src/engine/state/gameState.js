// src/engine/state/gameState.js

export const gameState = {
  player: {
    x: 50,
    y: 50,
    speed: 1.5,
    dx: 0, // horizontal direction
    dy: 0, // vertical direction
  },
  status: "running", // running | paused
};
