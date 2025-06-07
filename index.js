// Dino Game - Fullscreen, Score, Cactus, Flying Dinos, Sound, Restart, Menu, Mobile-friendly

document.addEventListener('DOMContentLoaded', () => { const canvas = document.getElementById('gameCanvas'); const ctx = canvas.getContext('2d');

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; groundY = canvas.height - 60; dino.y = groundY; cactus.y = groundY; ground.y = groundY + 40; }

let gravity = 1.5; let jumpPower = -20; let groundY;

let score = 0; let isJumping = false; let isDucking = false; let velocity = 0; let gameOver = false; let gameStarted = false;

const dino = { x: 50, y: 0, width: 40, height: 40, color: '#2ecc71', draw() { ctx.fillStyle = this.color; ctx.fillRect(this.x, this.y, this.width, this.height); } };

const cactus = { x: 0, y: 0, width: 20, height: 40, color: '#e74c3c', speed: 6 };

const flyingDinos = []; const flyingDinoSpeed = 8; const flyingDinoSize = { width: 40, height: 30 };

const ground = { x1: 0, x2: 0, y: 0, height: 20, speed: 6, color: '#7f8c8d' };

const sounds = { jump: new Audio('https://actions.google.com/sounds/v1/cartoon/slide_whistle_to_drum_hit.ogg'), hit: new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'), score: new Audio('https://actions.google.com/sounds/v1/cartoon/boing.ogg'), };

function spawnFlyingDino() { const yOptions = [groundY - 60, groundY - 100]; flyingDinos.push({ x: canvas.width, y: yOptions[Math.floor(Math.random() * yOptions.length)], width: flyingDinoSize.width, height: flyingDinoSize.height, color: '#9b59b6' }); }

function update() { if (!gameStarted) { ground.x1 -= ground.speed; ground.x2 -= ground.speed; if (ground.x1 + canvas.width <= 0) ground.x1 = ground.x2 + canvas.width; if (ground.x2 + canvas.width <= 0) ground.x2 = ground.x1 + canvas.width; return; }

if (isJumping) {
  velocity += gravity;
  dino.y += velocity;
  if (dino.y >= groundY) {
    dino.y = groundY;
    velocity = 0;
    isJumping = false;
  }
}

cactus.x -= cactus.speed;
if (cactus.x + cactus.width < 0) {
  cactus.x = canvas.width + Math.random() * 300;
  score++;
  sounds.score.play();
}

for (let i = flyingDinos.length - 1; i >= 0; i--) {
  flyingDinos[i].x -= flyingDinoSpeed;
  if (flyingDinos[i].x + flyingDinos[i].width < 0) {
    flyingDinos.splice(i, 1);
    score++;
    sounds.score.play();
  }
}

if (frame % 150 === 0) spawnFlyingDino();

// Ground scroll
ground.x1 -= ground.speed;
ground.x2 -= ground.speed;
if (ground.x1 + canvas.width <= 0) ground.x1 = ground.x2 + canvas.width;
if (ground.x2 + canvas.width <= 0) ground.x2 = ground.x1 + canvas.width;

// Collision cactus
if (dino.x < cactus.x + cactus.width && dino.x + dino.width > cactus.x &&
    dino.y < cactus.y + cactus.height && dino.y + dino.height > cactus.y) {
  endGame();
}

// Collision flying dino
for (const fd of flyingDinos) {
  if (dino.x < fd.x + fd.width && dino.x + dino.width > fd.x &&
      dino.y < fd.y + fd.height && dino.y + dino.height > fd.y) {
    endGame();
  }
}

}

function draw() { ctx.clearRect(0, 0, canvas.width, canvas.height);

// Ground
ctx.fillStyle = ground.color;
ctx.fillRect(ground.x1, ground.y, canvas.width, ground.height);
ctx.fillRect(ground.x2, ground.y, canvas.width, ground.height);

// Dino & obstacles
dino.draw();
ctx.fillStyle = cactus.color;
ctx.fillRect(cactus.x, cactus.y, cactus.width, cactus.height);
flyingDinos.forEach(fd => {
  ctx.fillStyle = fd.color;
  ctx.fillRect(fd.x, fd.y, fd.width, fd.height);
});

// Score
ctx.fillStyle = '#2c3e50';
ctx.font = '20px Arial';
ctx.fillText(`Score: ${score}`, 20, 30);

if (!gameStarted) {
  ctx.fillStyle = '#34495e';
  ctx.font = '30px Arial';
  ctx.fillText('Press Space or Tap to Start', canvas.width / 2 - 180, canvas.height / 2);
}

if (gameOver) {
  ctx.fillStyle = 'red';
  ctx.font = '40px Arial';
  ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
}

}

function gameLoop() { frame++; update(); draw(); requestAnimationFrame(gameLoop); }

function startGame() { gameStarted = true; gameOver = false; score = 0; cactus.x = canvas.width; flyingDinos.length = 0; velocity = 0; dino.y = groundY; }

function endGame() { if (!gameOver) { gameOver = true; sounds.hit.play(); setTimeout(startGame, 2000); } }

function jump() { if (!gameStarted) return startGame(); if (!isJumping && !gameOver) { isJumping = true; velocity = jumpPower; sounds.jump.play(); } }

// Events document.addEventListener('keydown', e => { if (e.code === 'Space') jump(); });

canvas.addEventListener('touchstart', e => { e.preventDefault(); jump(); });

let frame = 0; resizeCanvas(); gameLoop(); });

