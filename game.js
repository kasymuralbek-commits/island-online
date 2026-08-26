const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let W = 0;
let H = 0;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

const TILE = 32;
const WORLD_W = 180;
const WORLD_H = 70;

const world = Array.from(
  { length: WORLD_H },
  () => Array(WORLD_W).fill(0)
);

// 1 — трава, 2 — земля, 3 — камень, 4 — дерево, 5 — листья
for (let x = 0; x < WORLD_W; x++) {
  const ground =
    38 +
    Math.floor(Math.sin(x * 0.12) * 3) +
    Math.floor(Math.sin(x * 0.04) * 4);

  for (let y = ground; y < WORLD_H; y++) {
    world[y][x] = y === ground ? 1 : y < ground + 5 ? 2 : 3;
  }
}

// Деревья
for (let x = 8; x < WORLD_W - 5; x += 15) {
  const ground = world.findIndex(row => row[x] !== 0);

  if (ground > 7) {
    for (let y = ground - 1; y >= ground - 6; y--) {
      world[y][x] = 4;
    }

    for (let y = ground - 8; y <= ground - 5; y++) {
      for (let xx = x - 3; xx <= x + 3; xx++) {
        if (
          xx >= 0 &&
          xx < WORLD_W &&
          Math.abs(xx - x) +
            Math.abs(y - (ground - 6)) < 5
        ) {
          world[y][xx] = 5;
        }
      }
    }
  }
}

const player = {
  x: 14 * TILE,
  y: 30 * TILE,
  width: 22,
  height: 28,
  vx: 0,
  vy: 0,
  onGround: false
};

const keys = {};

window.addEventListener("keydown", e => {
  keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", e => {
  keys[e.key.toLowerCase()] = false;
});

function solid(px, py) {
  const tx = Math.floor(px / TILE);
  const ty = Math.floor(py / TILE);

  if (tx < 0 || tx >= WORLD_W || ty >= WORLD_H) {
    return true;
  }

  if (ty < 0) {
    return false;
  }

  return world[ty][tx] !== 0;
}

function collision(px, py) {
  return (
    solid(px, py) ||
    solid(px + player.width, py) ||
    solid(px, py + player.height) ||
    solid(
      px + player.width,
      py + player.height
    )
  );
}

let cameraX = 0;
let cameraY = 0;

function update() {
  const left =
    keys["a"] || keys["arrowleft"];

  const right =
    keys["d"] || keys["arrowright"];

  const jump =
    keys["w"] ||
    keys["arrowup"] ||
    keys[" "];

  if (left) {
    player.vx -= 0.45;
  }

  if (right) {
    player.vx += 0.45;
  }

  player.vx *= 0.82;

  player.vx = Math.max(
    -4,
    Math.min(4, player.vx)
  );

  if (jump && player.onGround) {
    player.vy = -10;
    player.onGround = false;
  }

  player.vy += 0.45;

  if (player.vy > 12) {
    player.vy = 12;
  }

  let nextX = player.x + player.vx;

  if (!collision(nextX, player.y)) {
    player.x = nextX;
  } else {
    player.vx = 0;
  }

  let nextY = player.y + player.vy;

  if (!collision(player.x, nextY)) {
    player.y = nextY;
    player.onGround = false;
  } else {
    if (player.vy > 0) {
      player.onGround = true;
    }

    player.vy = 0;
  }

  cameraX +=
    (player.x - W / 2 - cameraX) * 0.12;

  cameraY +=
    (player.y - H / 2 - cameraY) * 0.12;

  cameraX = Math.max(
    0,
    Math.min(WORLD_W * TILE - W, cameraX)
  );

  cameraY = Math.max(
    0,
    Math.min(WORLD_H * TILE - H, cameraY)
  );
}

function drawBlock(type, sx, sy) {
  if (type === 1) {
    ctx.fillStyle = "#55b947";
    ctx.fillRect(sx, sy, TILE, TILE);

    ctx.fillStyle = "#398f35";
    ctx.fillRect(
      sx,
      sy + 7,
      TILE,
      TILE - 7
    );
  }

  if (type === 2) {
    ctx.fillStyle = "#99613b";
    ctx.fillRect(sx, sy, TILE, TILE);
  }

  if (type === 3) {
    ctx.fillStyle = "#69727b";
    ctx.fillRect(sx, sy, TILE, TILE);

    ctx.fillStyle = "#555d66";
    ctx.fillRect(sx + 6, sy + 7, 5, 5);
    ctx.fillRect(sx + 21, sy + 18, 5, 5);
  }

  if (type === 4) {
    ctx.fillStyle = "#76502e";
    ctx.fillRect(
      sx + 9,
      sy,
      14,
      TILE
    );
  }

  if (type === 5) {
    ctx.fillStyle = "#2f9144";
    ctx.fillRect(
      sx + 2,
      sy + 3,
      TILE - 4,
      TILE - 6
    );

    ctx.fillStyle = "#45aa51";
    ctx.fillRect(
      sx + 7,
      sy
