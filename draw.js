import { canvas, ctx } from "./canvas.js";
import { state, player, bullets, enemies, bugs, meanFishes, VERSION, PLAYER_RADIUS, POWER_DURATION, BUG_LIFETIME, BUG_FADE_DURATION, MEAN_FISH_MAX_HP } from "./state.js";
import { drawAxolotl } from "./axolotl.js";
import { drawFish } from "./fish.js";
import { drawBug } from "./bug.js";

export function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!state.gameStarted) return;

  if (state.gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "bold 40px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillStyle = "white";
    ctx.font = "28px sans-serif";
    ctx.fillText("Score: " + state.score, canvas.width / 2, canvas.height / 2 + 30);
    ctx.fillStyle = "#aaa";
    ctx.font = "22px sans-serif";
    ctx.fillText("Tap anywhere to play again", canvas.width / 2, canvas.height / 2 + 80);
    return;
  }

  // Tap target indicator
  ctx.beginPath();
  ctx.arc(player.targetX, player.targetY, 14, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(0, 255, 255, 0.3)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Player
  drawAxolotl(player.x, player.y, PLAYER_RADIUS, player.angle);

  // Bullets (water bubbles)
  bullets.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(120, 220, 255, 0.55)";
    ctx.fill();
    ctx.strokeStyle = "rgba(180, 240, 255, 0.9)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.35, b.radius * 0.28, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fill();
  });

  // Enemies
  enemies.forEach(e => {
    drawFish(e.x, e.y, e.size, e.angle ?? 0);
  });

  // Mean fish — drawn in red and health pips
  const MEAN_FISH_COLORS = { body: "#8c2e2e", dark: "#551a1a", belly: "#e8b8b8", fin: "#701d1d" };
  meanFishes.forEach(mf => {
    drawFish(mf.x, mf.y, mf.size, mf.angle ?? 0, MEAN_FISH_COLORS);

    // Health bar — always horizontal above the fish, regardless of rotation
    const barW  = 54;
    const barH  = 8;
    const barR  = barH / 2;
    const barX  = mf.x - barW / 2;
    const barY  = mf.y - mf.size * 0.68;
    const fillW = barW * (mf.hp / MEAN_FISH_MAX_HP);

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur  = 4;

    // Dark track
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, barR);
    ctx.fill();

    // Filled portion
    if (fillW > barR * 2) {
      ctx.shadowColor = "#ff4040";
      ctx.shadowBlur  = 6;
      ctx.fillStyle   = "#e82020";
      ctx.beginPath();
      ctx.roundRect(barX, barY, fillW, barH, barR);
      ctx.fill();
    }

    ctx.restore();
  });

  // Bugs — fade out during the final BUG_FADE_DURATION ms of their lifetime
  const now = performance.now();
  bugs.forEach(b => {
    const age = now - b.spawnTime;
    const fadeStart = BUG_LIFETIME - BUG_FADE_DURATION;
    const alpha = age > fadeStart ? 1 - (age - fadeStart) / BUG_FADE_DURATION : 1;
    drawBug(b.x, b.y, b.angle ?? 0, alpha);
  });

  // HUD
  ctx.fillStyle = "white";
  ctx.font = "22px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Score: " + state.score, 20, 36);

  // Power-up countdown bar — only shown while the power-up is active
  if (state.powerUpExpiry > 0) {
    const elapsed  = performance.now();
    const fraction = Math.max(0, (state.powerUpExpiry - elapsed) / POWER_DURATION);
    const barW = 140;
    const barH = 9;
    const barX = 20;
    const barY = 52;
    const r    = barH / 2;

    // Dark track
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, r);
    ctx.fill();

    // Filled portion with glow
    const fillW = barW * fraction;
    if (fillW > r * 2) {
      const grad = ctx.createLinearGradient(barX, 0, barX + fillW, 0);
      grad.addColorStop(0, "#a8e020");
      grad.addColorStop(1, "#e8ff50");
      ctx.save();
      ctx.shadowColor  = "#c8ff40";
      ctx.shadowBlur   = 8;
      ctx.fillStyle    = grad;
      ctx.beginPath();
      ctx.roundRect(barX, barY, fillW, barH, r);
      ctx.fill();
      ctx.restore();
    }
  }

  ctx.fillStyle = "#555";
  ctx.font = "16px sans-serif";
  ctx.fillText(`v${VERSION}`, 20, canvas.height - 14);
}
