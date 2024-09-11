// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load the sprite image
const spriteImage = new Image();
spriteImage.src = 'character.png'; // Replace with the path to your image

// Sprite object with position and speed
const sprite = {
    x: canvas.width / 2 - 32, // Start at the center (assuming sprite is 64x64)
    y: canvas.height / 2 - 32,
    width: 64,  // Width of the sprite
    height: 64, // Height of the sprite
    speed: 4    // Speed of movement
};

// Object to store the current state of pressed keys
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false
};

// Event listeners for key presses
window.addEventListener('keydown', function(e) {
    if (e.key in keys) {
        keys[e.key] = true;
    }
});
window.addEventListener('keyup', function(e) {
    if (e.key in keys) {
        keys[e.key] = false;
    }
});

// Update the sprite's position based on key input
function updateSprite() {
    if (keys.ArrowLeft) {
        sprite.x -= sprite.speed;
    }
    if (keys.ArrowRight) {
        sprite.x += sprite.speed;
    }
    if (keys.ArrowUp) {
        sprite.y -= sprite.speed;
    }
    if (keys.ArrowDown) {
        sprite.y += sprite.speed;
    }

    // Prevent sprite from moving off canvas
    if (sprite.x < 0) sprite.x = 0;
    if (sprite.y < 0) sprite.y = 0;
    if (sprite.x + sprite.width > canvas.width) sprite.x = canvas.width - sprite.width;
    if (sprite.y + sprite.height > canvas.height) sprite.y = canvas.height - sprite.height;
}

// Render the sprite on the canvas
function drawSprite() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    ctx.drawImage(spriteImage, sprite.x, sprite.y, sprite.width, sprite.height); // Draw sprite
}

// Main game loop
function gameLoop() {
    updateSprite();
    drawSprite();
    requestAnimationFrame(gameLoop); // Keep the loop running
}

// Start the game once the image is loaded
spriteImage.onload = function() {
    gameLoop();
};
