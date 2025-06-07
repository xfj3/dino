document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  let gravity = 1.5;
  let jumpPower = -20;
  let groundY;

  let score = 0;
  let isJumping = false;
  let isDucking = false;
  let velocity = 0;
  let gameOver = false;
  let gameStarted = false;

  // Dino sizes
  const dinoStanding = { width: 40, height: 40 };
  const dinoDucking = { width: 50, height: 25 };

  // Sounds - replace URLs or paths with your files!
  const sounds = {
    jump: new Audio('https://actions.google.com/sounds/v1/cartoon/slide_whistle_to_drum_hit.ogg'),
    hit: new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'),
    score: new Audio('https://actions.google.com/sounds/v1/cartoon/boing.ogg'),
  };

  const dino = {
    x: 50,
    y: 0, // will set after resize
    width: dinoStanding.width,
    height: dinoStanding.height,
    color: '#2ecc71',
    draw() {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };

  const cactus = {
    x: 0, // will set after resize
    y: 0, // will set after resize
    width: 20,
    height: 40,
    color: '#e74c3c',
    speed: 6
  };

  const flyingDinos = [];
  const flyingDinoSpeed = 8;
  const flyingDinoWidth = 40;
  const flyingDinoHeight = 30;

  let frameCount = 0;

  // Background ground properties for loop
  const ground = {
    x1: 0,
    x2: 0, // will set after resize
    y: 0,  // will set after resize
    height: 20,
    speed: 6,
    color: '#7f8c8d'
  };

  // Resize canvas and adjust game elements
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    groundY = canvas.height - 60;

    dino.y = gameStarted && !isJumping ? groundY : dino.y;

    cactus.x = canvas.width;
    cactus.y = groundY;

    ground.x1 = 0;
    ground.x2 = canvas.width;
    ground.y = groundY + 40;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function spawnFlyingDino() {
    const heights = [groundY - 60, groundY - 100];
    const y = heights[Math.floor(Math.random() * heights.length)];
    flyingDinos.push({
      x: canvas.width,
      y: y,
      width: flyingDinoWidth,
      height: flyingDinoHeight,
      color: '#9b59b6'
    });
  }

  function update() {
    if (!gameStarted) {
      // Move background ground in menu screen
      ground.x1 -= ground.speed;
      ground.x2 -= ground.speed;
      if (ground.x1 + canvas.width <= 0) ground.x1 = ground.x2 + canvas.width;
      if (ground.x2 + canvas.width <= 0) ground.x2 = ground.x1 + canvas.width;
      return;
    }

    if (isJumping) {
      velocity += gravity;
      dino.y += velocity;
      if (dino.y >= groundY) {
        dino.y = groundY;
        velocity = 0;
        isJumping = false;
      }
    }

    if (isDucking && !isJumping) {
      dino.width = dinoDucking.width;
      dino.height = dinoDucking.height;
      dino.y = groundY + (dinoStanding.height - dinoDucking.height);
    } else if (!isJumping) {
      dino.width = dinoStanding.width;
      dino.height = dinoStanding.height;
      dino.y = groundY;
    }

    cactus.x -= cactus.speed;
    if (cactus.x + cactus.width < 0) {
      cactus.x = canvas.width + Math.random() * 500;
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

    frameCount++;
    if (frameCount % 150 === 0) {
      spawnFlyingDino();
    }

    // Collision detection cactus
    if (
      dino.x < cactus.x + cactus.width &&
      dino.x + dino.width > cactus.x &&
      dino.y < cactus.y + cactus.height &&
      dino.y + dino.height > cactus.y
    ) {
      triggerGameOver();
    }

    // Collision detection flying dinos
    for (const fDino of flyingDinos) {
      if (
        dino.x < fDino.x + fDino.width &&
        dino.x + dino.width > fDino.x &&
        dino.y < fDino.y + fDino.height &&
        dino.y + dino.height > fDino.y
      ) {
        triggerGameOver();
      }
    }

    // Move background ground in game too
    ground.x1 -= ground.speed;
    ground.x2 -= ground.speed;
    if (ground.x1 + canvas.width <= 0) ground.x1 = ground.x2 + canvas.width;
    if (ground.x2 + canvas.width <= 0) ground.x2 = ground.x1 + canvas.width;
  }

  function drawGround() {
    ctx.fillStyle = ground.color;
    ctx.fillRect(ground.x1, ground.y, canvas.width, ground.height);
    ctx.fillRect(ground.x2, ground.y, canvas.width, ground.height);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGround();

    dino.draw();

    ctx.fillStyle = cactus.color;
    ctx.fillRect(cactus.x, cactus.y, cactus.width, cactus.height);

    for (const fDino of flyingDinos) {
      ctx.fillStyle = fDino.color;
      ctx.fillRect(fDino.x, fDino.y, fDino.width, fDino.height);
    }

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

  function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }

  function jump() {
    if (!gameStarted) {
      startGame();
      return;
    }
    if (!isJumping && !gameOver) {
      isJumping = true;
      isDucking = false;
      velocity = jumpPower;
      sounds.jump.play();
    }
  }

  function duck(start) {
    if (!gameStarted) return;
    if (!gameOver && !isJumping) {
      isDucking = start;
    }
  }

  function startGame() {
    gameStarted = true;
    gameOver = false;
    score = 0;
    cactus.x = canvas.width;
    flyingDinos.length = 0;
    dino.y = groundY;
  }

  function triggerGameOver() {
    if (!gameOver) {
      gameOver = true;
      sounds.hit.play();

      setTimeout(() => {
        startGame();
      }, 2000);
    }
  }

  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ') jump();
    if (e.code === 'ArrowDown') duck(true);
  });

  document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowDown') duck(false);
  });

  // Touch controls
  let touchStartY = null;

  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (e.touches.length === 1 && touchStartY !== null) {
      let touchCurrentY = e.touches[0].clientY;
      if (touchCurrentY - touchStartY > 30) {
        duck(true);
      }
    }
  }, { passive: false });

  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    if (isDucking) duck(false);
    if (!gameOver && !isDucking
