const c = document.getElementById("game");
const x = c.getContext("2d");

let W, H;

function resize() {
  W = c.width = innerWidth;
  H = c.height = innerHeight;
}

resize();
addEventListener("resize", resize);

const keys = {};

addEventListener("keydown", e => {
  keys[e.key.toLowerCase()] = true;
});

addEventListener("keyup", e => {
  keys[e.key.toLowerCase()] = false;
});

const player = {
  x: 200,
  y: 100,
  vx: 0,
  vy: 0,
  w: 28,
  h: 48,
  ground: false
};

function update() {
  player.vx = 0;

  if (keys["a"] || keys["arrowleft"]) {
    player.vx = -4;
  }

  if (keys["d"] || keys["arrowright"]) {
    player.vx = 4;
  }

  if (
    (keys["w"] ||
     keys["arrowup"] ||
     keys[" "]) &&
    player.ground
  ) {
    player.vy = -11;
    player.ground = false;
  }

  player.vy += 0.5;

  player.x += player.vx;
  player.y += player.vy;

  const ground = H - 190;

  if (player.y + player.h >= ground) {
    player.y = ground - player.h;
    player.vy = 0;
    player.ground = true;
  }

  if (player.x < 0) player.x = 0;
  if (player.x > W - player.w) {
    player.x = W - player.w;
  }
}

function drawTree(px, py) {
  x.fillStyle = "#70401f";
  x.fillRect(px - 12, py, 24, 100);

  x.fillStyle = "#258a38";

  x.beginPath();
  x.arc(px, py, 55, 0, Math.PI * 2);
  x.fill();

  x.beginPath();
  x.arc(px - 35, py + 25, 40, 0, Math.PI * 2);
  x.fill();

  x.beginPath();
  x.arc(px + 35, py + 25, 40, 0, Math.PI * 2);
  x.fill();
}
  x.fillStyle = "#70401f";
  x.fillRect(x - 12, y, 24, 100);

  x.fillStyle = "#258a38";

  x.beginPath();
  x.arc(x, y, 55, 0, Math.PI * 2);
  x.fill();

  x.beginPath();
  x.arc(x - 35, y + 25, 40, 0, Math.PI * 2);
  x.fill();

  x.beginPath();
  x.arc(x + 35, y + 25, 40, 0, Math.PI * 2);
  x.fill();
}

function draw() {
  // Небо
  x.fillStyle = "#62c5ef";
  x.fillRect(0, 0, W, H);

  // Солнце
  x.fillStyle = "#ffe06b";
  x.beginPath();
  x.arc(W - 90, 90, 40, 0, Math.PI * 2);
  x.fill();

  // Земля
  x.fillStyle = "#55a83f";
  x.fillRect(0, H - 190, W, 30);

  // Грязь
  x.fillStyle = "#8b5a2b";
  x.fillRect(0, H - 160, W, 160);

  // Камни
  x.fillStyle = "#777";
  for (let i = 0; i < W; i += 70) {
    x.fillRect(i, H - 110, 30, 30);
  }

  // Деревья
  for (let i = 80; i < W; i += 220) {
    drawTree(i, H - 270);
  }

  // Игрок
  x.fillStyle = "#f2c28b";
  x.fillRect(
    player.x + 4,
    player.y,
    20,
    20
  );

  x.fillStyle = "#57351f";
  x.fillRect(
    player.x + 3,
    player.y,
    22,
    7
  );

  x.fillStyle = "#2875c7";
  x.fillRect(
    player.x,
    player.y + 20,
    28,
    20
  );

  x.fillStyle = "#333";
  x.fillRect(
    player.x + 3,
    player.y + 40,
    9,
    8
  );

  x.fillRect(
    player.x + 17,
    player.y + 40,
    9,
    8
  );

  // Интерфейс
  x.fillStyle = "rgba(0,0,0,0.65)";
  x.fillRect(15, 15, 230, 65);

  x.fillStyle = "#fff";
  x.font = "bold 22px Arial";
  x.fillText("ISLAND ONLINE", 28, 43);

  x.font = "15px Arial";
  x.fillText("A/D — движение", 28, 65);

  x.fillText(
    "W / ↑ / Space — прыжок",
    28,
    100
  );
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
