document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Responsive canvas
    canvas.width = window.innerWidth;
    canvas.height = 300;

    // Game state
    let isJumping = false;
    let y = canvas.height - 60;
    let velocity = 0;
    const gravity = 1.5;
    const jumpPower = -20;

    // Dino settings
    const dino = {
        x: 50,
        y: y,
        width: 40,
        height: 40,
        color: '#2ecc71'
    };

    function drawDino() {
        ctx.fillStyle = dino.color;
        ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
    }

    function update() {
        if (isJumping) {
            velocity += gravity;
            dino.y += velocity;

            if (dino.y >= y) {
                dino.y = y;
                isJumping = false;
                velocity = 0;
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawDino();
    }

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    // Input handlers
    function jump() {
        if (!isJumping) {
            isJumping = true;
            velocity = jumpPower;
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.key === ' ') {
            jump();
        }
    });

    // Mobile touch support
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        jump();
    }, { passive: false });

    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = 300;
        y = canvas.height - 60;
        dino.y = y;
    });

    // Start the game loop
    gameLoop();
});
