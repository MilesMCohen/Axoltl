export const canvas = document.createElement("canvas");
export const ctx = canvas.getContext("2d");

document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.body.appendChild(canvas);

export function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
resize();
