const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 200;

let dino = {
    x: 50,
    y: 150,
    width: 40,
    height: 40,
    color: "green"
};

let gravity = 0.6;
let velocityY = 0;
let jumpForce = 12;
let isJumping = false;

function drawDino() {
    ctx.fillStyle = dino.color;
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
}

function update() {
    // Apply gravity
    velocityY += gravity;
    dino.y += velocityY;

    // Ground collision
    if (dino.y > 150) {
        dino.y = 150;
        velocityY = 0;
        isJumping = false;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw dino
    drawDino();

    // Repeat
    requestAnimationFrame(update);
}

// Handle key press
document.addEventListener("keydown", function (event) {
    if (event.code === "Space" || event.code === "ArrowUp") {
        if (!isJumping) {
            isJumping = true;
            velocityY = -jumpForce;
        }
    }
});

// Start game loop
update();
