import { canvas } from "./canvas.js";
import { state, player, bullets, enemies, PLAYER_SPEED, PLAYER_RADIUS } from "./state.js";

export function update() {
  if (!state.gameStarted || state.gameOver) return;

  // Move player toward tap target at constant speed
  const dx = player.targetX - player.x;
  const dy = player.targetY - player.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > PLAYER_SPEED) {
    // atan2 + PI/2 converts canvas movement angle to "facing up = 0" draw angle
    player.angle = Math.atan2(dy, dx) + Math.PI / 2;
    player.x += (dx / dist) * PLAYER_SPEED;
    player.y += (dy / dist) * PLAYER_SPEED;
  } else {
    player.x = player.targetX;
    player.y = player.targetY;
  }

  // Clamp player to screen
  player.x = Math.max(PLAYER_RADIUS, Math.min(canvas.width - PLAYER_RADIUS, player.x));
  player.y = Math.max(PLAYER_RADIUS, Math.min(canvas.height - PLAYER_RADIUS, player.y));

  // Update bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= bullets[i].speed;
    if (bullets[i].y < 0) bullets.splice(i, 1);
  }

  // Update enemies
  for (let ei = enemies.length - 1; ei >= 0; ei--) {
    const e = enemies[ei];
    e.y += e.speed;

    // Collision with player
    const pdx = e.x - player.x;
    const pdy = e.y - player.y;
    if (Math.sqrt(pdx * pdx + pdy * pdy) < e.size / 2 + PLAYER_RADIUS * 0.7) {
      state.gameOver = true;
    }

    // Collision with bullets
    for (let bi = bullets.length - 1; bi >= 0; bi--) {
      const b = bullets[bi];
      const bdx = e.x - b.x;
      const bdy = e.y - b.y;
      if (Math.sqrt(bdx * bdx + bdy * bdy) < e.size / 2 + b.radius) {
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
        state.score++;
        break;
      }
    }

    if (e.y > canvas.height + 40) enemies.splice(ei, 1);
  }
}
