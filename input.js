import { state, player, bullets, enemies, VERSION } from "./state.js";

export function initInput() {
  document.getElementById("version-label").textContent = `v${VERSION}`;

  document.getElementById("start-btn").onclick = () => {
    player.x = window.innerWidth / 2;
    player.y = window.innerHeight / 2;
    player.targetX = player.x;
    player.targetY = player.y;
    state.gameStarted = true;
    document.getElementById("start-overlay").style.display = "none";
  };

  // Tap to move, or restart after game over
  window.addEventListener("pointerdown", (e) => {
    if (!state.gameStarted) return;

    if (state.gameOver) {
      state.score = 0;
      state.gameOver = false;
      enemies.length = 0;
      bullets.length = 0;
      player.x = window.innerWidth / 2;
      player.y = window.innerHeight / 2;
      player.targetX = player.x;
      player.targetY = player.y;
      return;
    }

    player.targetX = e.clientX;
    player.targetY = e.clientY;
  });

  // Keep updating target while finger is dragged
  window.addEventListener("pointermove", (e) => {
    if (!state.gameStarted || state.gameOver) return;
    if (e.buttons === 0 && e.pressure === 0) return;
    player.targetX = e.clientX;
    player.targetY = e.clientY;
  });
}
