import { canvas } from "./canvas.js";

export const VERSION = "1.2.0";

export const PLAYER_SPEED = 6;
export const PLAYER_RADIUS = 28;

// Mutable game state wrapped in an object so imports stay in sync
export const state = {
  gameStarted: false,
  score: 0,
  gameOver: false,
};

export const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  targetX: canvas.width / 2,
  targetY: canvas.height / 2,
  angle: 0, // radians, 0 = facing up
};

export const bullets = [];
export const enemies = [];
