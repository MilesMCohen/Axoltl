import { canvas } from "./canvas.js";
import { state, player, bullets, enemies, PLAYER_RADIUS } from "./state.js";
import { update } from "./update.js";
import { draw } from "./draw.js";
import { initInput } from "./input.js";

initInput();

// Auto-shoot upward on a fixed interval
setInterval(() => {
  if (!state.gameStarted || state.gameOver) return;
  bullets.push({
    x: player.x,
    y: player.y - PLAYER_RADIUS,
    radius: 6,
    speed: 10,
  });
}, 400);

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

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
