import { ctx } from "./canvas.js";

// Draws a firefly-style bug facing up at angle=0.
// cx/cy is the center; collision radius is ~16px at scale 1.
export function drawBug(cx, cy, angle = 0, alpha = 1) {
  const s = 0.9;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  // Outer soft glow
  const outerGlow = ctx.createRadialGradient(0, 6 * s, 0, 0, 6 * s, 22 * s);
  outerGlow.addColorStop(0, "rgba(190, 255, 60, 0.22)");
  outerGlow.addColorStop(1, "rgba(190, 255, 60, 0)");
  ctx.beginPath();
  ctx.ellipse(0, 6 * s, 22 * s, 22 * s, 0, 0, Math.PI * 2);
  ctx.fillStyle = outerGlow;
  ctx.fill();

  // Wings (translucent, behind body)
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.translate(side * 11 * s, -2 * s);
    ctx.rotate(side * 0.3);
    ctx.beginPath();
    ctx.ellipse(0, 0, 9 * s, 5 * s, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(220, 255, 210, 0.28)";
    ctx.fill();
    ctx.strokeStyle = "rgba(180, 245, 170, 0.45)";
    ctx.lineWidth = 0.7 * s;
    ctx.stroke();
    ctx.restore();
  }

  // Legs (3 per side)
  ctx.strokeStyle = "#243318";
  ctx.lineWidth = 1.2 * s;
  ctx.lineCap = "round";
  for (const side of [-1, 1]) {
    for (const ly of [-4, 1, 6]) {
      ctx.beginPath();
      ctx.moveTo(side * 7 * s, ly * s);
      ctx.lineTo(side * 17 * s, (ly + 5) * s);
      ctx.stroke();
    }
  }

  // Abdomen with bioluminescent gradient
  const abdGrad = ctx.createRadialGradient(0, 10 * s, 1, 0, 7 * s, 13 * s);
  abdGrad.addColorStop(0,   "#deff60");
  abdGrad.addColorStop(0.5, "#8ec020");
  abdGrad.addColorStop(1,   "#3d6008");
  ctx.beginPath();
  ctx.ellipse(0, 8 * s, 8 * s, 13 * s, 0, 0, Math.PI * 2);
  ctx.fillStyle = abdGrad;
  ctx.fill();

  // Abdomen segments
  ctx.strokeStyle = "rgba(40, 70, 0, 0.45)";
  ctx.lineWidth = 1 * s;
  for (const sy of [3, 8, 13]) {
    ctx.beginPath();
    ctx.moveTo(-6 * s, sy * s);
    ctx.quadraticCurveTo(0, (sy + 1.2) * s, 6 * s, sy * s);
    ctx.stroke();
  }

  // Bright tail-glow spot
  const tailGlow = ctx.createRadialGradient(0, 19 * s, 0, 0, 18 * s, 8 * s);
  tailGlow.addColorStop(0, "rgba(230, 255, 100, 0.9)");
  tailGlow.addColorStop(1, "rgba(180, 240, 0, 0)");
  ctx.beginPath();
  ctx.ellipse(0, 18 * s, 6 * s, 4 * s, 0, 0, Math.PI * 2);
  ctx.fillStyle = tailGlow;
  ctx.fill();

  // Thorax
  ctx.beginPath();
  ctx.ellipse(0, -5 * s, 7 * s, 5.5 * s, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#2a4a10";
  ctx.fill();

  // Head
  ctx.beginPath();
  ctx.arc(0, -13 * s, 5 * s, 0, Math.PI * 2);
  ctx.fillStyle = "#1a3008";
  ctx.fill();

  // Eyes (small amber dots)
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(side * 3 * s, -14.5 * s, 2 * s, 0, Math.PI * 2);
    ctx.fillStyle = "#ffdd44";
    ctx.fill();
  }

  // Antennae
  ctx.strokeStyle = "#1a3008";
  ctx.lineWidth = 1 * s;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(side * 2 * s, -17 * s);
    ctx.quadraticCurveTo(side * 8 * s, -26 * s, side * 11 * s, -24 * s);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(side * 11 * s, -24 * s, 1.5 * s, 0, Math.PI * 2);
    ctx.fillStyle = "#1a3008";
    ctx.fill();
  }

  ctx.restore();
}
