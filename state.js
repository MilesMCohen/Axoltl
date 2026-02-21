import { canvas } from "./canvas.js";

export const VERSION = "1.7.1";

export const PLAYER_SPEED = 6;
export const PLAYER_RADIUS = 28;
export const BUG_RADIUS = 16;

export const MEAN_FISH_SPEED    = 3;     // px/frame — slower than the player
export const MEAN_FISH_SIZE     = 110;   // draw size
export const MEAN_FISH_MAX_HP   = 2;     // bubbles needed to kill it
export const MEAN_FISH_INTERVAL = 20000; // ms between mean-fish spawns

export const BASE_BULLET_INTERVAL  = 700;  // ms between bubbles normally
export const POWER_BULLET_INTERVAL = 350;  // ms between bubbles while powered up
export const POWER_SPEED_BOOST     = 4;    // px/frame added while powered up
export const POWER_DURATION        = 5000; // ms the power-up lasts
export const BUG_LIFETIME          = 8000; // ms before an uneaten bug disappears
export const BUG_FADE_DURATION     = 2000;  // ms over which the bug fades out before vanishing

// Mutable game state wrapped in an object so imports stay in sync
export const state = {
  gameStarted: false,
  score: 0,
  gameOver: false,
  speedBoost:      0,                   // 0 normally; POWER_SPEED_BOOST while active
  bulletInterval:  BASE_BULLET_INTERVAL,
  lastBulletTime:  0,
  powerUpExpiry:   0,                   // performance.now() deadline; 0 = inactive
};

export const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  targetX: canvas.width / 2,
  targetY: canvas.height / 2,
  angle: 0, // radians, 0 = facing up
};

export const bullets    = [];
export const enemies    = [];
export const bugs       = [];
export const meanFishes = [];
