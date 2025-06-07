// Dino Game - Fullscreen, Mobile-Friendly, Score, Obstacles, Flying Dinos, Restart Button, Menu, Sound Effects

document.addEventListener('DOMContentLoaded', () => { const canvas = document.getElementById('gameCanvas'); const ctx = canvas.getContext('2d');

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; groundY = canvas.height - 100; dino.y = groundY - dino.height; cactus.y = groundY - cactus.height; ground.y = groundY + 40; }

let gravity = 1.5; let jumpPower = -20; let groundY;

let score = 0; let isJumping = false; let velocity = 0; let gameOver = false; let gameStarted = false;

const images = {}; const loadImage = (key, src) => { const img = new Image(); img.src = src; images[key] = img; };

loadImage('dino', 'https://raw.githubusercontent.com/itsron717/dino-game-assets/main/dino.png'); loadImage('cactus', 'https://raw.githubusercontent.com/itsron717/dino-game-assets/main/cactus.png'); loadImage('flyDino', 'https://raw.githubusercontent.com/itsron717/dino-game-assets/main/pterodactyl.png'); loadImage('ground', 'https://raw.githubusercontent.com/itsron717/dino-game-assets/main/ground.png'); loadImage('bg', 'https://raw.githubusercontent.com/itsron717/dino-game-assets/main/bg.png');

const dino = { x: 50, y: 0, width: 60, height: 60 };

const cactus = { x: 0, y: 0, width: 40, height: 60, speed: 6 };

const flyingDinos = []; const flyingDinoSpeed = 8; const flyingDinoSize = { width: 60, height: 40 };

const ground = { x1: 0, x2: 0, y: 0, height: 40, speed: 6 };

const sounds = { jump: new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_988d2452c3.mp3'), hit: new Audio('https://cdn.pixabay.com/audio/2022/10/24/audio_2f35187452.mp3'), score: new Audio('https://cdn.pixabay.com/audio/2022/02/23/audio_7d661cf7b3.mp3'), };

function spawnFlyingDino() { const yOptions = [groundY - 120, groundY - 180]; flyingDinos.push({ x: canvas.width, y: yOptions[Math.floor(Math.random() * yOptions.length)], width: flyingDinoSize.width, height: flyingDinoSize.height }); }

function update() { if (!gameStarted || gameOver) return;

if (isJumping) {
  velocity += gravity;
  dino.y += velocity;
  if (dino.y >= groundY - dino.height) {
    dino.y = groundY - dino.height;
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

ground.x1 -= ground.speed;
ground.x2 -= ground.speed;
if (ground.x1 + canvas.width <= 0) ground.x1 = ground.x2 + canvas.width;
if (ground.x2 + canvas.width <= 0) ground.x2 = ground.x1 + canvas.width;

if (dino.x < cactus.x + cactus.width && dino.x + dino.width > cactus.x &&
    dino.y < cactus.y + cactus.height && dino.y + dino.height > cactus.y) {
  endGame();
}

for (const fd of flyingDinos) {
  if (dino.x < fd.x + fd.width && dino.x + dino.width > fd.x &&
      dino.y < fd.y + fd.height && dino.y + dino.height > fd.y) {
    endGame();
  }
}

}

function draw() { ctx.clearRect(0, 0, canvas.width, canvas.height);

ctx.drawImage(images.bg, 0, 0, canvas.width, canvas.height);
ctx.drawImage(images.ground, ground.x1, ground.y, canvas.width, ground.height);
ctx.drawImage(images.ground, ground.x2, ground.y, canvas.width, ground.height);

ctx.drawImage(images.dino, dino.x, dino.y, dino.width, dino.height);
ctx.drawImage(images.cactus, cactus.x, cactus.y, cactus.width, cactus.height);
flyingDinos.forEach(fd => {
  ctx.drawImage(images.flyDino, fd.x, fd.y, fd.width, fd.height);
});

ctx.fillStyle = '#2c3e50';
ctx.font = '20px Arial';
ctx.fillText(`Score: ${score}`, 20, 30);

if (!gameStarted) {
  ctx.fillStyle = '#34495e';
  ctx.font = '30px Arial';
  ctx.fillText('Tap or Press Space to Start', canvas.width / 2 - 180, canvas.height / 2);
}

if (gameOver) {
  ctx.fillStyle = 'red';
  ctx.font = '40px Arial';
  ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
  ctx.font = '30px Arial';
  ctx.fillText('Tap or Press Space to Restart', canvas.width / 2 - 180, canvas.height / 2 + 40);
}

}

function gameLoop() { frame++; update(); draw(); requestAnimationFrame(gameLoop); }

function startGame() { gameStarted = true; gameOver = false; score = 0; cactus.x = canvas.width; flyingDinos.length = 0; velocity = 0; dino.y = groundY - dino.height; }

function endGame() { if (!gameOver) { gameOver = true; sounds.hit.play(); } }

function jump() { if (!gameStarted || gameOver) { startGame(); return; } if (!isJumping && !gameOver) { isJumping = true; velocity = jumpPower; sounds.jump.play(); } }

document.addEventListener('keydown', e => { if (e.code === 'Space') jump(); });

canvas.addEventListener('touchstart', e => { e.preventDefault(); jump(); });

let frame = 0; resizeCanvas(); window.addEventListener('resize', resizeCanvas); gameLoop(); });

