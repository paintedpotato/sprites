// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load the sprite and door images
const playerImage = new Image();
playerImage.src = 'character.png'; // Replace with the path to your player image

const doorImage = new Image();
doorImage.src = 'door.png'; // Replace with the path to your door image

const enemyImage = new Image();
enemyImage.src = 'enemy.png'; // Replace with the path to your enemy image

// Player object
const player = {
    x: canvas.width / 2 - 32,
    y: canvas.height / 2 - 32,
    width: 64,
    height: 64,
    speed: 4,
    alive: true,
    laserReady: true
};

// Array to hold enemies
let enemies = [];
let enemySpeed = 1;

// Object to store key presses
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false
};

// Event listeners for key presses
window.addEventListener('keydown', function (e) {
    if (e.key in keys) {
        keys[e.key] = true;
    }
});
window.addEventListener('keyup', function (e) {
    if (e.key in keys) {
        keys[e.key] = false;
    }
});

// Function to spawn enemies at random positions
function spawnEnemy() {
    const enemy = {
        x: canvas.width - 50, // Start from top-right corner
        y: Math.random() * (canvas.height / 2), // Random Y position in upper half
        width: 64,
        height: 64,
        speed: enemySpeed // Set their speed
    };
    enemies.push(enemy);
}

// Function to update player movement
function updatePlayer() {
    if (keys.ArrowLeft) player.x -= player.speed;
    if (keys.ArrowRight) player.x += player.speed;
    if (keys.ArrowUp) player.y -= player.speed;
    if (keys.ArrowDown) player.y += player.speed;

    // Boundaries
    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

// Function to update enemies
function updateEnemies() {
    enemies.forEach((enemy, index) => {
        // Move enemy towards the player
        if (enemy.x > player.x) enemy.x -= enemy.speed;
        if (enemy.y > player.y) enemy.y -= enemy.speed;
        if (enemy.x < player.x) enemy.x += enemy.speed;
        if (enemy.y < player.y) enemy.y += enemy.speed;

        // Check for collision with player (Game Over)
        if (isColliding(player, enemy)) {
            player.alive = false;
        }
    });
}

// Function to check for collision between two rectangles (player and enemy)
function isColliding(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

// Function to draw player, enemies, and door
function drawGameObjects() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the player
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    // Draw the door (goal)
    ctx.drawImage(doorImage, canvas.width - 100, canvas.height - 100, 64, 64);

    // Draw enemies
    enemies.forEach(enemy => {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

// Function to fire a laser (once every second)
function fireLaser() {
    if (player.laserReady) {
        player.laserReady = false;
        // Laser logic: find enemies within a certain distance and remove them
        enemies = enemies.filter((enemy) => {
            const distance = Math.hypot(enemy.x - player.x, enemy.y - player.y);
            if (distance < 150) {
                // Kill enemy, respawn 2 more enemies with faster speed
                for (let i = 0; i < 2; i++) {
                    spawnEnemy();
                }
                enemySpeed += 0.2; // Increase speed of new enemies
                return false; // Remove the enemy
            }
            return true;
        });

        // Cooldown period before laser can fire again
        setTimeout(() => {
            player.laserReady = true;
        }, 1000);
    }
}

// Main game loop
function gameLoop() {
    if (!player.alive) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '48px serif';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        return;
    }

    updatePlayer();
    updateEnemies();
    drawGameObjects();

    requestAnimationFrame(gameLoop); // Continue loop
}

// Initial spawning of enemies and start the game
setInterval(spawnEnemy, 2000); // Spawn enemy every 2 seconds
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        fireLaser();
    }
});

playerImage.onload = function () {
    gameLoop(); // Start the game when player image is loaded
};
