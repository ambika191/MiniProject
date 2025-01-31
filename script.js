const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game settings
const gridSize = 20;
let canvasSize = 400; // Default size
let snake = [
  { x: 160, y: 160 },
  { x: 140, y: 160 },
  { x: 120, y: 160 }
];

let food = { x: 0, y: 0 };
let direction = "RIGHT";
let score = 0;
let gameInterval;
// const eatSound = document.getElementById("eatSound");
// const gameOverSound = document.getElementById("gameOverSound");

function resizeCanvas() {
  // Resize canvas to full screen
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvasSize = Math.min(canvas.width, canvas.height) - (Math.min(canvas.width, canvas.height) % gridSize); // Ensure it fits grid size
}

function startGame() {
  resizeCanvas();
  document.addEventListener("keydown", changeDirection);
  generateFood();
  gameInterval = setInterval(gameLoop, 100);
}

function gameLoop() {
  updateSnake();
  checkCollisions();
  draw();
}

function updateSnake() {
  const head = { ...snake[0] };

  switch (direction) {
    case "UP":
      head.y -= gridSize;
      break;
    case "DOWN":
      head.y += gridSize;
      break;
    case "LEFT":
      head.x -= gridSize;
      break;
    case "RIGHT":
      head.x += gridSize;
      break;
  }

  // Wrap snake around the canvas
  if (head.x >= canvasSize) head.x = 0; // Wrap right to left
  if (head.x < 0) head.x = canvasSize - gridSize; // Wrap left to right
  if (head.y >= canvasSize) head.y = 0; // Wrap bottom to top
  if (head.y < 0) head.y = canvasSize - gridSize; // Wrap top to bottom

  snake.unshift(head);

  // Check if the snake ate food
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    document.getElementById("score").innerText = `Score: ${score}`;
    // eatSound.play();
    generateFood();
  } else {
    snake.pop();
  }
}

function changeDirection(event) {
  if (event.key === "ArrowUp" && direction !== "DOWN") {
    direction = "UP";
  } else if (event.key === "ArrowDown" && direction !== "UP") {
    direction = "DOWN";
  } else if (event.key === "ArrowLeft" && direction !== "RIGHT") {
    direction = "LEFT";
  } else if (event.key === "ArrowRight" && direction !== "LEFT") {
    direction = "RIGHT";
  }
}

function generateFood() {
  food.x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
  food.y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "green" : "lightgreen";
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
  });

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function checkCollisions() {
  const head = snake[0];

  // Self-collision check (if snake runs into itself)
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver();
    }
  }
}

function gameOver() {
  clearInterval(gameInterval);
  // gameOverSound.play();
  alert("Game Over! Final Score: " + score);
  document.location.reload();
}

window.addEventListener("resize", resizeCanvas);

startGame();
