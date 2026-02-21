import { canvas } from "./canvas.js";
import {
  state, player, bullets, enemies, bugs,
  PLAYER_SPEED, PLAYER_RADIUS, BUG_RADIUS,
  BASE_BULLET_INTERVAL, POWER_BULLET_INTERVAL, POWER_SPEED_BOOST, POWER_DURATION,
} from "./state.js";

export function update() {
  if (!state.gameStarted || state.gameOver) return;

  const now = performance.now();

  // Expire the power-up when its 10-second window closes
  if (state.powerUpExpiry > 0 && now >= state.powerUpExpiry) {
    state.powerUpExpiry  = 0;
    state.speedBoost     = 0;
    state.bulletInterval = BASE_BULLET_INTERVAL;
  }

  // Auto-shoot bubbles at the current (dynamic) interval
  if (now - state.lastBulletTime >= state.bulletInterval) {
    state.lastBulletTime = now;
    bullets.push({
      x: player.x,
      y: player.y - PLAYER_RADIUS,
      radius: 6,
      speed: 10,
    });
  }

  // Move player toward tap target — speed increases with each bug eaten
  const speed = PLAYER_SPEED + state.speedBoost;
  const dx = player.targetX - player.x;
  const dy = player.targetY - player.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > speed) {
    // atan2 + PI/2 converts canvas movement angle to "facing up = 0" draw angle
    player.angle = Math.atan2(dy, dx) + Math.PI / 2;
    player.x += (dx / dist) * speed;
    player.y += (dy / dist) * speed;
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
    e.x += e.vx;

    // Bounce off side walls
    if (e.x - e.size / 2 < 0) {
      e.x = e.size / 2;
      e.vx = Math.abs(e.vx);
    } else if (e.x + e.size / 2 > canvas.width) {
      e.x = canvas.width - e.size / 2;
      e.vx = -Math.abs(e.vx);
    }

    // Face the direction of travel (fish drawn pointing down = angle 0)
    e.angle = Math.atan2(-e.vx, e.speed);

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

    if (e.y > canvas.height + e.size) enemies.splice(ei, 1);
  }

  // Update bugs — gentle wander, bounce off edges, eaten by player
  const MAX_BUG_SPEED = 1.6;
  for (let i = bugs.length - 1; i >= 0; i--) {
    const bug = bugs[i];

    // Slightly nudge velocity each frame for organic wandering
    bug.vx += (Math.random() - 0.5) * 0.18;
    bug.vy += (Math.random() - 0.5) * 0.18;

    // Clamp to max wander speed
    const spd = Math.sqrt(bug.vx * bug.vx + bug.vy * bug.vy);
    if (spd > MAX_BUG_SPEED) {
      bug.vx = (bug.vx / spd) * MAX_BUG_SPEED;
      bug.vy = (bug.vy / spd) * MAX_BUG_SPEED;
    }

    bug.x += bug.vx;
    bug.y += bug.vy;

    // Rotate to face direction of travel (up = angle 0)
    if (spd > 0.05) bug.angle = Math.atan2(bug.vy, bug.vx) + Math.PI / 2;

    // Bounce off screen edges
    const m = BUG_RADIUS;
    if (bug.x < m)                    { bug.x = m;                    bug.vx =  Math.abs(bug.vx); }
    if (bug.x > canvas.width  - m)    { bug.x = canvas.width  - m;    bug.vx = -Math.abs(bug.vx); }
    if (bug.y < m)                    { bug.y = m;                     bug.vy =  Math.abs(bug.vy); }
    if (bug.y > canvas.height - m)    { bug.y = canvas.height - m;     bug.vy = -Math.abs(bug.vy); }

    // Player eats the bug — activate (or reset) the 10-second power-up
    const ex = bug.x - player.x;
    const ey = bug.y - player.y;
    if (Math.sqrt(ex * ex + ey * ey) < BUG_RADIUS + PLAYER_RADIUS * 0.85) {
      bugs.splice(i, 1);
      state.powerUpExpiry  = now + POWER_DURATION;
      state.speedBoost     = POWER_SPEED_BOOST;
      state.bulletInterval = POWER_BULLET_INTERVAL;
    }
  }
}
