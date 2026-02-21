import { canvas } from "./canvas.js";

export const VERSION = "1.5.1";

export const PLAYER_SPEED = 6;
export const PLAYER_RADIUS = 28;
export const BUG_RADIUS = 16;

// Base bullet interval (ms) and minimum after power-ups
export const BASE_BULLET_INTERVAL = 400;
export const MIN_BULLET_INTERVAL  = 120;

// Mutable game state wrapped in an object so imports stay in sync
export const state = {
  gameStarted: false,
  score: 0,
  gameOver: false,
  bugsEaten:      0,
  speedBoost:     0,   // added to PLAYER_SPEED; +0.8 per bug, capped at +6
  bulletInterval: BASE_BULLET_INTERVAL,
  lastBulletTime: 0,
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
export const bugs    = [];
