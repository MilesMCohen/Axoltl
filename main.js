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

// Spawn enemies
setInterval(() => {
  if (!state.gameStarted || state.gameOver) return;
  enemies.push({
    x: Math.random() * canvas.width,
    y: -30,
    size: 30,
    speed: 2 + Math.random() * 2,
  });
}, 1000);

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
