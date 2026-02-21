// Arcade Tilt Shooter - Single File Starter
// Works with iPad Safari (requests motion permission)

const VERSION = "1.0.4";

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
let tiltEnabled = false;
let tiltX = 0;
let score = 0;
let gameOver = false;

const player = {
  x: canvas.width / 2,
  y: canvas.height - 80,
  width: 50,
  height: 20,
  speed: 8
};

const bullets = [];
const enemies = [];

function spawnEnemy() {
  enemies.push({
    x: Math.random() * canvas.width,
    y: -20,
    size: 30,
    speed: 2 + Math.random() * 2
  });
}

setInterval(() => {
  if (gameStarted && !gameOver) spawnEnemy();
}, 1000);


// Tilt controls
function handleTilt(event) {
  tiltX = event.gamma || 0; // left/right tilt
}

// iOS permission — must be called synchronously from a user gesture (no async/await)
function enableTilt() {
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    DeviceOrientationEvent.requestPermission()
      .then(permission => {
        if (permission === "granted") {
          window.addEventListener("deviceorientation", handleTilt);
          tiltEnabled = true;
        } else {
          alert("Motion permission denied. Go to Settings > Safari > Motion & Orientation Access to enable it.");
        }
      })
      .catch(err => {
        alert("Tilt error: " + err.message + "\n\nMake sure the page is served over HTTPS.");
      });
  } else {
    window.addEventListener("deviceorientation", handleTilt);
    tiltEnabled = true;
  }
}

function update() {
  if (!gameStarted || gameOver) return;

  // Move player from tilt
  if (tiltEnabled) {
    player.x += tiltX * 0.5;
  }

  // Clamp player
  player.x = Math.max(player.width / 2, Math.min(canvas.width - player.width / 2, player.x));

  // Update bullets
  bullets.forEach((b, i) => {
    b.y -= b.speed;
    if (b.y < 0) bullets.splice(i, 1);
  });

  // Update enemies
  enemies.forEach((e, ei) => {
    e.y += e.speed;

    // Collision with player
    if (
      e.y + e.size > player.y &&
      Math.abs(e.x - player.x) < e.size
    ) {
      gameOver = true;
    }

    // Collision with bullets
    bullets.forEach((b, bi) => {
      if (
        Math.abs(e.x - b.x) < e.size / 2 &&
        Math.abs(e.y - b.y) < e.size / 2
      ) {
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
        score++;
      }
    });

    if (e.y > canvas.height) enemies.splice(ei, 1);
  });
}

function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!gameStarted) return;

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "36px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
    ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 40);
    return;
  }

  // Player
  ctx.fillStyle = "cyan";
  ctx.fillRect(
    player.x - player.width / 2,
    player.y,
    player.width,
    player.height
  );

  // Bullets
  ctx.fillStyle = "yellow";
  bullets.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  // Enemies
  ctx.fillStyle = "orange";
  enemies.forEach(e => {
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.size / 2, 0, Math.PI * 2);
    ctx.fill();
  });

  // Score
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Score: " + score, 20, 30);

  ctx.fillStyle = tiltEnabled ? "lime" : "gray";
  ctx.fillText(
    tiltEnabled ? `Tilt: ${tiltX.toFixed(1)}°` : "Tilt: off",
    20,
    55
  );

  ctx.fillStyle = "#555";
  ctx.fillText(`v${VERSION}`, 20, 80);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();

// Start button — real HTML button click is the most trusted iOS user gesture
document.getElementById("start-btn").onclick = () => {
  enableTilt();
  gameStarted = true;
  document.getElementById("start-overlay").style.display = "none";
};

// Tap to shoot during gameplay
window.addEventListener("pointerdown", () => {
  if (!gameStarted || gameOver) return;
  bullets.push({
    x: player.x,
    y: player.y - 20,
    radius: 5,
    speed: 8
  });
});

// Tap to restart after game over
window.addEventListener("pointerdown", () => {
  if (!gameOver) return;
  score = 0;
  enemies.length = 0;
  bullets.length = 0;
  gameOver = false;
});