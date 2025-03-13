      const canvas = document.getElementById("gameCanvas");
      const ctx = canvas.getContext("2d");

      const gridSize = 20;
      let canvasSize = 400;
      let snake = [
        { x: 160, y: 160 },
        { x: 140, y: 160 },
        { x: 120, y: 160 }
      ];

      let food = { x: 0, y: 0 };
      let direction = "RIGHT";
      let score = 0;
      let gameInterval;
      let gameRunning = false;

      function resizeCanvas() {
        canvas.width = canvasSize;
        canvas.height = canvasSize;
      }

      function startGame() {
        document.getElementById("startScreen").style.display = "none";
        gameRunning = true;
        score = 0;
        document.getElementById("score").innerText = `Score: ${score}`;
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

        if (head.x >= canvasSize) head.x = 0;
        if (head.x < 0) head.x = canvasSize - gridSize;
        if (head.y >= canvasSize) head.y = 0;
        if (head.y < 0) head.y = canvasSize - gridSize;

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
          score += 10;
          document.getElementById("score").innerText = `Score: ${score}`;
          generateFood();
        } else {
          snake.pop();
        }
      }

      function changeDirection(event) {
        if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
        else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
        else if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
        else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
      }

      function generateFood() {
        food.x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
        food.y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
      }

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        snake.forEach((segment, index) => {
          const gradient = ctx.createLinearGradient(0, 0, canvasSize, canvasSize);
          gradient.addColorStop(0, "limegreen");
          gradient.addColorStop(1, "green");
          ctx.fillStyle = index === 0 ? "white" : gradient;
          ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
          ctx.strokeStyle = "black";
          ctx.strokeRect(segment.x, segment.y, gridSize, gridSize);
        });

        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      function checkCollisions() {
        const head = snake[0];
        for (let i = 1; i < snake.length; i++) {
          if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
          }
        }
      }

      function gameOver() {
        clearInterval(gameInterval);
        gameRunning = false;
        document.getElementById("finalScore").innerText = score;
        document.getElementById("gameOverScreen").style.display = "block";
      }

      function restartGame() {
        document.getElementById("gameOverScreen").style.display = "none";
        snake = [
          { x: 160, y: 160 },
          { x: 140, y: 160 },
          { x: 120, y: 160 }
        ];
        direction = "RIGHT";
        score = 0;
        document.getElementById("score").innerText = "Score: 0";
        startGame();
      }
    