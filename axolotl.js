import { ctx } from "./canvas.js";

export function drawAxolotl(cx, cy, r, angle) {
  const s = r / 28;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  const bodyColor = "#FFB3C6";
  const darkPink   = "#E8688A";
  const gillColor  = "#FF6B9D";

  // Tail
  ctx.beginPath();
  ctx.ellipse(0, 24 * s, 9 * s, 14 * s, 0, 0, Math.PI * 2);
  ctx.fillStyle = darkPink;
  ctx.fill();

  // Back legs
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.translate(side * 17 * s, 17 * s);
    ctx.rotate(side * 0.45);
    ctx.beginPath();
    ctx.ellipse(0, 0, 9 * s, 4.5 * s, 0, 0, Math.PI * 2);
    ctx.fillStyle = bodyColor;
    ctx.fill();
    ctx.restore();
  }

  // Body
  ctx.beginPath();
  ctx.ellipse(0, 8 * s, 16 * s, 22 * s, 0, 0, Math.PI * 2);
  ctx.fillStyle = bodyColor;
  ctx.fill();

  // Front legs
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.translate(side * 20 * s, -1 * s);
    ctx.rotate(side * 0.3);
    ctx.beginPath();
    ctx.ellipse(0, 0, 9 * s, 4.5 * s, 0, 0, Math.PI * 2);
    ctx.fillStyle = bodyColor;
    ctx.fill();
    ctx.restore();
  }

  // Head
  ctx.beginPath();
  ctx.arc(0, -14 * s, 16 * s, 0, Math.PI * 2);
  ctx.fillStyle = bodyColor;
  ctx.fill();

  // Gills — 3 feathery stalks per side
  function drawGill(gx, gy, tilt, len) {
    ctx.save();
    ctx.translate(gx, gy);
    ctx.rotate(tilt);
    ctx.lineCap = "round";
    ctx.lineWidth = 2.5 * s;
    ctx.strokeStyle = gillColor;

    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -len); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -len * 0.45); ctx.lineTo(-len * 0.48, -len * 0.82); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -len * 0.45); ctx.lineTo( len * 0.48, -len * 0.82); ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -len, 2.2 * s, 0, Math.PI * 2);
    ctx.fillStyle = gillColor;
    ctx.fill();
    ctx.restore();
  }

  const gl = 16 * s;
  drawGill(-15 * s, -24 * s, -0.85, gl * 0.82);
  drawGill(-17 * s, -27 * s, -0.45,  gl);
  drawGill(-12 * s, -28 * s, -1.15, gl * 0.72);
  drawGill( 15 * s, -24 * s,  0.85, gl * 0.82);
  drawGill( 17 * s, -27 * s,  0.45,  gl);
  drawGill( 12 * s, -28 * s,  1.15, gl * 0.72);

  // Eyes
  for (const [ex, ep] of [[-6, -1], [6, 1]]) {
    ctx.beginPath();
    ctx.arc(ex * s, -16 * s, 5 * s, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.beginPath();
    ctx.arc((ex + ep) * s, -16 * s, 3 * s, 0, Math.PI * 2);
    ctx.fillStyle = "#1a0a00";
    ctx.fill();

    // Shine
    ctx.beginPath();
    ctx.arc((ex + ep * 1.8) * s, -17.5 * s, 1.2 * s, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  }

  // Smile
  ctx.beginPath();
  ctx.arc(0, -10 * s, 5 * s, 0.3, Math.PI - 0.3);
  ctx.strokeStyle = darkPink;
  ctx.lineWidth = 2 * s;
  ctx.lineCap = "round";
  ctx.stroke();

  // Cheek blush
  ctx.fillStyle = "rgba(255, 100, 150, 0.3)";
  for (const bx of [-10, 10]) {
    ctx.beginPath();
    ctx.arc(bx * s, -11 * s, 4.5 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
