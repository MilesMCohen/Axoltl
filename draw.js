import { canvas, ctx } from "./canvas.js";
import { state, player, bullets, enemies, bugs, VERSION, PLAYER_RADIUS } from "./state.js";
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

  // Bugs
  bugs.forEach(b => drawBug(b.x, b.y, b.angle ?? 0));

  // HUD
  ctx.fillStyle = "white";
  ctx.font = "22px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Score: " + state.score, 20, 36);

  // Power pip indicators — one small glowing dot per bug eaten
  if (state.bugsEaten > 0) {
    const pipCount = Math.min(state.bugsEaten, 8);
    const pipRadius   = 6;
    const pipSpacing  = 17;
    const startX      = 20 + pipRadius;
    const pipY        = 78;
    for (let i = 0; i < pipCount; i++) {
      const px = startX + i * pipSpacing;
      const glow = ctx.createRadialGradient(px, pipY, 0, px, pipY, pipRadius * 2.2);
      glow.addColorStop(0, "rgba(200, 255, 60, 0.5)");
      glow.addColorStop(1, "rgba(200, 255, 60, 0)");
      ctx.beginPath();
      ctx.arc(px, pipY, pipRadius * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px, pipY, pipRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#c8ff40";
      ctx.fill();
    }
  }

  ctx.fillStyle = "#555";
  ctx.font = "16px sans-serif";
  ctx.fillText(`v${VERSION}`, 20, canvas.height - 14);
}
