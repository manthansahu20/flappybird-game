const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Bird properties
let bird = { x: 50, y: 150, width: 20, height: 20, velocity: 0 };
const gravity = 0.6;
const jumpStrength = -10;

// Pipes
let pipes = [];
const pipeWidth = 50;
const pipeGap = 130;
let frame = 0;
let score = 0;

// Spawn new pipes
function spawnPipe() {
  const topHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
  pipes.push({ x: canvas.width, topHeight: topHeight });
}

// Game update logic
function update() {
  frame++;

  // Bird physics
  bird.velocity += gravity;
  bird.y += bird.velocity;

  // Add pipes
  if (frame % 90 === 0) spawnPipe();

  // Move pipes
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= 2;

    // Add score when bird passes pipe
    if (!pipes[i].scored && pipes[i].x + pipeWidth < bird.x) {
      score++;
      pipes[i].scored = true;
    }
  }

  // Remove pipes off screen
  pipes = pipes.filter(p => p.x + pipeWidth > 0);

  // Collision detection
  for (let p of pipes) {
    if (
      bird.x < p.x + pipeWidth &&
      bird.x + bird.width > p.x &&
      (bird.y < p.topHeight || bird.y + bird.height > p.topHeight + pipeGap)
    ) {
      gameOver();
    }
  }

  // Hit top or bottom
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver();
  }
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Bird
  ctx.fillStyle = 'yellow';
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

  // Pipes
  ctx.fillStyle = 'green';
  for (let p of pipes) {
    ctx.fillRect(p.x, 0, pipeWidth, p.topHeight);
    ctx.fillRect(p.x, p.topHeight + pipeGap, pipeWidth, canvas.height - (p.topHeight + pipeGap));
  }

  // Score
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
}

// Main game loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Bird jump
function jump() {
  bird.velocity = jumpStrength;
}

// Game over function
function gameOver() {
  alert('Game Over! Score: ' + score);
  document.location.reload();
}

// Controls
document.addEventListener('keydown', e => {
  if (e.code === 'Space') jump();
});
document.addEventListener('click', jump);

// Start game
loop();
