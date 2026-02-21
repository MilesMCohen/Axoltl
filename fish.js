import { ctx } from "./canvas.js";

// Draws a menacing fish facing in the given direction.
// angle=0 means facing down (default travel direction); rotate to match velocity.
// cx/cy is the body center; size controls overall scale.
export function drawFish(cx, cy, size, angle = 0, colors = {}) {
  const s = size / 50;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  const bodyColor  = colors.body   ?? "#2e6b8c";
  const bodyDark   = colors.dark   ?? "#1a3f55";
  const bellyColor = colors.belly  ?? "#b8dce8";
  const finColor   = colors.fin    ?? "#1d5570";

  // Forked tail (top)
  ctx.beginPath();
  ctx.moveTo(-4 * s, -24 * s);
  ctx.lineTo(-24 * s, -50 * s);
  ctx.lineTo(-6 * s,  -36 * s);
  ctx.lineTo(0,       -30 * s);
  ctx.lineTo(6 * s,   -36 * s);
  ctx.lineTo(24 * s,  -50 * s);
  ctx.lineTo(4 * s,   -24 * s);
  ctx.closePath();
  ctx.fillStyle = bodyDark;
  ctx.fill();

  // Dorsal fin
  ctx.beginPath();
  ctx.moveTo(-8 * s, -20 * s);
  ctx.lineTo(-5 * s, -34 * s);
  ctx.lineTo(5 * s,  -34 * s);
  ctx.lineTo(8 * s,  -20 * s);
  ctx.closePath();
  ctx.fillStyle = finColor;
  ctx.fill();

  // Main body
  ctx.beginPath();
  ctx.ellipse(0, 0, 18 * s, 27 * s, 0, 0, Math.PI * 2);
  ctx.fillStyle = bodyColor;
  ctx.fill();

  // Belly
  ctx.beginPath();
  ctx.ellipse(0, 5 * s, 10 * s, 18 * s, 0, 0, Math.PI * 2);
  ctx.fillStyle = bellyColor;
  ctx.fill();

  // Scales (subtle arc rows)
  ctx.strokeStyle = "rgba(0,0,0,0.12)";
  ctx.lineWidth = 1.2 * s;
  for (let row = -2; row <= 1; row++) {
    for (let col = -1; col <= 1; col++) {
      const sx = col * 10 * s + (((row + 10) % 2) * 5 * s);
      const sy = row * 9 * s;
      if (Math.abs(sx) < 15 * s && sy > -22 * s && sy < 18 * s) {
        ctx.beginPath();
        ctx.arc(sx, sy, 5.5 * s, Math.PI, 0);
        ctx.stroke();
      }
    }
  }

  // Pectoral fins (sides)
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.translate(side * 17 * s, 5 * s);
    ctx.rotate(side * 0.5);
    ctx.beginPath();
    ctx.ellipse(side * 5 * s, 0, 14 * s, 5.5 * s, 0, 0, Math.PI * 2);
    ctx.fillStyle = finColor;
    ctx.fill();
    ctx.restore();
  }

  // Head / jaw
  ctx.beginPath();
  ctx.ellipse(0, 26 * s, 16 * s, 12 * s, 0, 0, Math.PI * 2);
  ctx.fillStyle = bodyColor;
  ctx.fill();

  // Open mouth (dark interior)
  ctx.beginPath();
  ctx.arc(0, 32 * s, 14 * s, 0, Math.PI);
  ctx.fillStyle = "#6b1515";
  ctx.fill();

  // Upper teeth
  ctx.fillStyle = "white";
  const teeth = 5;
  const gap = 5 * s;
  const startX = -((teeth - 1) / 2) * gap;
  for (let i = 0; i < teeth; i++) {
    const tx = startX + i * gap;
    ctx.beginPath();
    ctx.moveTo(tx - 2.5 * s, 32 * s);
    ctx.lineTo(tx,           40 * s);
    ctx.lineTo(tx + 2.5 * s, 32 * s);
    ctx.fill();
  }

  // Lower teeth (staggered, smaller)
  for (let i = 0; i < teeth - 1; i++) {
    const tx = startX + (i + 0.5) * gap;
    ctx.beginPath();
    ctx.moveTo(tx - 2 * s, 46 * s);
    ctx.lineTo(tx,         40 * s);
    ctx.lineTo(tx + 2 * s, 46 * s);
    ctx.fill();
  }

  // Eyes with menacing brows
  for (const side of [-1, 1]) {
    const ex = side * 8 * s;
    const ey = 16 * s;

    // White
    ctx.beginPath();
    ctx.arc(ex, ey, 6.5 * s, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();

    // Pupil
    ctx.beginPath();
    ctx.arc(ex + side * 0.5 * s, ey + 1.5 * s, 4 * s, 0, Math.PI * 2);
    ctx.fillStyle = "#0d0d0d";
    ctx.fill();

    // Angry inner-brow slash
    ctx.beginPath();
    ctx.moveTo(ex + side * -5 * s, ey - 5.5 * s);
    ctx.lineTo(ex + side *  4 * s, ey - 8 * s);
    ctx.strokeStyle = bodyDark;
    ctx.lineWidth = 2.5 * s;
    ctx.lineCap = "round";
    ctx.stroke();
  }

  ctx.restore();
}
