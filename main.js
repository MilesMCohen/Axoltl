// Tap-to-Move Arcade Shooter

const VERSION = "1.1.0";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.body.appendChild(canvas);

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

let gameStarted = false;
let score = 0;
let gameOver = false;

const PLAYER_SPEED = 6;
const PLAYER_RADIUS = 28;

const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  targetX: canvas.width / 2,
  targetY: canvas.height / 2,
  angle: 0, // radians, 0 = facing up
};

const bullets = [];
const enemies = [];

// Auto-shoot upward on a fixed interval
setInterval(() => {
  if (!gameStarted || gameOver) return;
  bullets.push({
    x: player.x,
    y: player.y - PLAYER_RADIUS,
    radius: 6,
    speed: 10
  });
}, 400);

setInterval(() => {
  if (gameStarted && !gameOver) {
    enemies.push({
      x: Math.random() * canvas.width,
      y: -30,
      size: 30,
      speed: 2 + Math.random() * 2
    });
  }
}, 1000);

function update() {
  if (!gameStarted || gameOver) return;

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
      gameOver = true;
    }

    // Collision with bullets
    for (let bi = bullets.length - 1; bi >= 0; bi--) {
      const b = bullets[bi];
      const bdx = e.x - b.x;
      const bdy = e.y - b.y;
      if (Math.sqrt(bdx * bdx + bdy * bdy) < e.size / 2 + b.radius) {
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
        score++;
        break;
      }
    }

    if (e.y > canvas.height + 40) enemies.splice(ei, 1);
  }
}

function drawAxolotl(cx, cy, r, angle) {
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

function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!gameStarted) return;

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "bold 40px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillStyle = "white";
    ctx.font = "28px sans-serif";
    ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 30);
    ctx.fillStyle = "#aaa";
    ctx.font = "22px sans-serif";
    ctx.fillText("Tap anywhere to play again", canvas.width / 2, canvas.height / 2 + 80);
    return;
  }

  // Draw tap target indicator
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
    // Bubble shine
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
    // Simple enemy face
    ctx.fillStyle = "#6b2600";
    ctx.beginPath();
    ctx.arc(e.x - 6, e.y - 4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(e.x + 6, e.y - 4, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // Score
  ctx.fillStyle = "white";
  ctx.font = "22px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Score: " + score, 20, 36);

  ctx.fillStyle = "#555";
  ctx.font = "16px sans-serif";
  ctx.fillText(`v${VERSION}`, 20, 60);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();

document.getElementById("start-btn").onclick = () => {
  player.x = canvas.width / 2;
  player.y = canvas.height / 2;
  player.targetX = canvas.width / 2;
  player.targetY = canvas.height / 2;
  gameStarted = true;
  document.getElementById("start-overlay").style.display = "none";
};

// Tap to move / restart
window.addEventListener("pointerdown", (e) => {
  if (!gameStarted) return;

  if (gameOver) {
    score = 0;
    enemies.length = 0;
    bullets.length = 0;
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    player.targetX = canvas.width / 2;
    player.targetY = canvas.height / 2;
    gameOver = false;
    return;
  }

  player.targetX = e.clientX;
  player.targetY = e.clientY;
});

// Keep updating target while finger is held and dragged
window.addEventListener("pointermove", (e) => {
  if (!gameStarted || gameOver) return;
  if (e.buttons === 0 && e.pressure === 0) return;
  player.targetX = e.clientX;
  player.targetY = e.clientY;
});