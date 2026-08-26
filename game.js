const c = document.getElementById("game");
const x = c.getContext("2d");

let W, H;

function resize() {
  W = innerWidth;
  H = innerHeight;
  c.width = W;
  c.height = H;
}
resize();
addEventListener("resize", resize);

const TILE = 32;
const COLS = 180;
const ROWS = 80;

const world = Array.from(
  { length: ROWS },
  () => Array(COLS).fill(0)
);

/* ОСТРОВ */
for (let i = 0; i < COLS; i++) {
  const surface =
    38 +
    Math.floor(Math.sin(i * 0.12) * 3) +
    Math.floor(Math.sin(i * 0.035) * 5);

  for (let j = surface; j < ROWS; j++) {
    if (j === surface) world[j][i] = 1;
    else if (j < surface + 5) world[j][i] = 2;
    else world[j][i] = 3;
  }
}

/* ДЕРЕВЬЯ */
for (let i = 8; i < COLS - 5; i += 14) {
  const s = world.findIndex(row => row[i] === 1);

  for (let j = s - 1; j >= s - 5; j--) {
    world[j][i] = 4;
  }

  for (let yy = s - 7; yy <= s - 4; yy++) {
    for (let xx = i - 2; xx <= i + 2; xx++) {
      if (xx >= 0 && xx < COLS && yy >= 0) {
        world[yy][xx] = 5;
      }
    }
  }
}

/* ПЕРСОНАЖ */
const player = {
  x: 12 * TILE,
  y: 30 * TILE,
  w: 22,
  h: 28,
  vx: 0,
  vy: 0,
  onGround: false
};

const keys = {};

addEventListener("keydown", e => {
  keys[e.key.toLowerCase()] = true;
});

addEventListener("keyup", e => {
  keys[e.key.toLowerCase()] = false;
});

/* ПРОВЕРКА БЛОКОВ */
function solid(px, py) {
  const tx = Math.floor(px / TILE);
  const ty = Math.floor(py / TILE);

  if (tx < 0 || tx >= COLS || ty >= ROWS) return true;
  if (ty < 0) return false;

  return world[ty][tx] !== 0;
}

function collision(px, py) {
  return (
    solid(px, py) ||
    solid(px + player.w, py) ||
    solid(px, py + player.h) ||
    solid(px + player.w, py + player.h)
  );
}

/* КАМЕРА */
let camX = 0;
let camY = 0;

/* ИГРОВОЕ ОБНОВЛЕНИЕ */
function update() {
  const left =
    keys["a"] ||
    keys["arrowleft"];

  const right =
    keys["d"] ||
    keys["arrowright"];

  const jump =
    keys["w"] ||
    keys["arrowup"] ||
    keys[" "];

  if (left) player.vx -= 0.45;
  if (right) player.vx += 0.45;

  player.vx *= 0.82;

  if (player.vx > 4) player.vx = 4;
  if (player.vx < -4) player.vx = -4;

  if (jump && player.onGround) {
    player.vy = -10;
    player.onGround = false;
  }

  player.vy += 0.45;

  if (player.vy > 12) {
    player.vy = 12;
  }

  let nx = player.x + player.vx;

  if (!collision(nx, player.y)) {
    player.x = nx;
  } else {
    player.vx = 0;
  }

  let ny = player.y + player.vy;

  if (!collision(player.x, ny)) {
    player.y = ny;
    player.onGround = false;
  } else {
    if (player.vy > 0) {
      player.onGround = true;
    }

    player.vy = 0;
  }

  camX +=
    (player.x - W / 2 - camX) * 0.12;

  camY +=
    (player.y - H / 2 - camY) * 0.12;

  camX = Math.max(
    0,
    Math.min(COLS * TILE -
  
