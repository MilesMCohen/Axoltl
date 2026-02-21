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

  // Player (axolotl-ish circle with face)
  ctx.beginPath();
  ctx.arc(player.x, player.y, PLAYER_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = "cyan";
  ctx.fill();

  // Simple face
  ctx.fillStyle = "#004444";
  ctx.beginPath();
  ctx.arc(player.x - 9, player.y - 6, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(player.x + 9, player.y - 6, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(player.x, player.y + 7, 7, 0, Math.PI);
  ctx.fillStyle = "#006666";
  ctx.fill();

  // Bullets
  ctx.fillStyle = "yellow";
  bullets.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
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