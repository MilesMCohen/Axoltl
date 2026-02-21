import { canvas } from "./canvas.js";
import { state, player, bullets, enemies, bugs, meanFishes, PLAYER_RADIUS, MEAN_FISH_SIZE, MEAN_FISH_MAX_HP, MEAN_FISH_INTERVAL } from "./state.js";
import { update } from "./update.js";
import { draw } from "./draw.js";
import { initInput } from "./input.js";

initInput();

// Bullet timing is now handled inside update() so the interval can change dynamically.

// Spawn a bug at a random position, up to MAX_BUGS on screen at once.
const MAX_BUGS = 5;
function spawnBug() {
  if (!state.gameStarted || state.gameOver) return;
  if (bugs.length >= MAX_BUGS) return;
  const margin = 60;
  bugs.push({
    x: margin + Math.random() * (canvas.width  - margin * 2),
    y: margin + Math.random() * (canvas.height - margin * 2),
    vx: (Math.random() - 0.5) * 1.6,
    vy: (Math.random() - 0.5) * 1.6,
    angle: 0,
    spawnTime: performance.now(),
  });
}

// First bug appears quickly; after that one arrives every ~5 s
setTimeout(spawnBug, 1500);
setInterval(spawnBug, 5000);

// Spawn enemies aimed at the player with a small random spread
setInterval(() => {
  if (!state.gameStarted || state.gameOver) return;

  const spawnX = Math.random() * canvas.width;
  const spawnY = -80;
  const totalSpeed = 4 + Math.random() * 3;

  // Direction from spawn point toward the player
  const dx = player.x - spawnX;
  const dy = player.y - spawnY;
  const len = Math.sqrt(dx * dx + dy * dy);

  // Random angular spread (±0.4 rad ≈ ±23°) so they sometimes miss
  const spread = (Math.random() - 0.5) * 0.4;
  const cos = Math.cos(spread);
  const sin = Math.sin(spread);

  // Rotate the unit direction vector by the spread angle
  const nx = (dx / len) * cos - (dy / len) * sin;
  const ny = (dx / len) * sin + (dy / len) * cos;

  enemies.push({
    x: spawnX,
    y: spawnY,
    size: 80,
    speed: ny * totalSpeed,
    vx:   nx * totalSpeed,
  });
}, 1000);

// Spawn a mean fish rising from the bottom, always hunting the player
setInterval(() => {
  if (!state.gameStarted || state.gameOver) return;
  meanFishes.push({
    x: MEAN_FISH_SIZE / 2 + Math.random() * (canvas.width - MEAN_FISH_SIZE),
    y: canvas.height + MEAN_FISH_SIZE,
    size: MEAN_FISH_SIZE,
    hp: MEAN_FISH_MAX_HP,
    vx: 0,
    vy: 0,
    angle: Math.PI, // starts facing up
  });
}, MEAN_FISH_INTERVAL);

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
