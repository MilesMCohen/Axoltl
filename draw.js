import { canvas, ctx } from "./canvas.js";
import { state, player, bullets, enemies, VERSION, PLAYER_RADIUS } from "./state.js";
import { drawAxolotl } from "./axolotl.js";

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
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.size / 2, 0, Math.PI * 2);
    ctx.fillStyle = "orange";
    ctx.fill();
    ctx.fillStyle = "#6b2600";
    ctx.beginPath();
    ctx.arc(e.x - 6, e.y - 4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(e.x + 6, e.y - 4, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // HUD
  ctx.fillStyle = "white";
  ctx.font = "22px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Score: " + state.score, 20, 36);

  ctx.fillStyle = "#555";
  ctx.font = "16px sans-serif";
  ctx.fillText(`v${VERSION}`, 20, 60);
}
