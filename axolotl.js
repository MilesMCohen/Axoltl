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
  // Each stalk has a central spine with small filaments branching off both
  // sides, shortening toward the tip, giving the characteristic feather look.
  function drawGill(gx, gy, tilt, len) {
    ctx.save();
    ctx.translate(gx, gy);
    ctx.rotate(tilt);
    ctx.lineCap = "round";
    ctx.strokeStyle = gillColor;

    // Central spine
    ctx.lineWidth = 2 * s;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len);
    ctx.stroke();

    // Filaments: 6 pairs, shorter near the tip
    ctx.lineWidth = 1.2 * s;
    const count = 6;
    for (let i = 1; i <= count; i++) {
      const frac  = i / (count + 1);
      const y     = -len * frac;
      const flen  = len * 0.38 * (1 - frac * 0.45);
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(side * flen, y - flen * 0.35);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  const gl = 16 * s;
  // Head: center (0, −14s), radius 16s.
  // Gill bases at −130°, −150°, −168° — spread down the upper-side arc.
  drawGill(-10.3 * s, -26.3 * s, -0.70, gl * 0.80); // −130°
  drawGill(-13.9 * s, -22.0 * s, -1.05,  gl);        // −150°
  drawGill(-15.6 * s, -17.3 * s, -1.36, gl * 0.85);  // −168°
  drawGill( 10.3 * s, -26.3 * s,  0.70, gl * 0.80);
  drawGill( 13.9 * s, -22.0 * s,  1.05,  gl);
  drawGill( 15.6 * s, -17.3 * s,  1.36, gl * 0.85);

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
