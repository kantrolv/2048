const grid = document.querySelector(".grid");
const scoreDisplay = document.getElementById("score");
let score = 0;
let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];


function generateTile() {
  const emptySpaces = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) {
        emptySpaces.push({ i, j });
      }
    }
  }

  if (emptySpaces.length > 0) {
    const randomSpace = emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    board[randomSpace.i][randomSpace.j] = value;
    updateBoard();
  }
}

// Function to update the board display
function updateBoard() {
  const tiles = document.querySelectorAll(".tile");
  tiles.forEach((tile, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = board[row][col];
    tile.innerText = value === 0 ? "" : value;
    tile.className = "tile"; // Reset tile class
    if (value > 0) {
      tile.classList.add(`tile-${value}`);
    }
  });
  scoreDisplay.innerText = score;
}

// Function to handle tile movement and merging
function move(direction) {
  let moved = false;
  if (direction === "left" || direction === "right") {
    for (let row = 0; row < 4; row++) {
      let filtered = board[row].filter(val => val !== 0);
      let merged = false;
      if (direction === "right") filtered.reverse();

      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1] && !merged) {
          filtered[i] *= 2;
          score += filtered[i];
          filtered[i + 1] = 0;
          merged = true;
        }
      }

      filtered = filtered.filter(val => val !== 0);
      while (filtered.length < 4) filtered.push(0);

      if (direction === "right") filtered.reverse();
      if (JSON.stringify(board[row]) !== JSON.stringify(filtered)) {
        moved = true;
        board[row] = filtered;
      }
    }
  } else if (direction === "up" || direction === "down") {
    for (let col = 0; col < 4; col++) {
      let filtered = [];
      for (let row = 0; row < 4; row++) {
        if (board[row][col] !== 0) {
          filtered.push(board[row][col]);
        }
      }

      let merged = false;
      if (direction === "down") filtered.reverse();

      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1] && !merged) {
          filtered[i] *= 2;
          score += filtered[i];
          filtered[i + 1] = 0;
          merged = true;
        }
      }

      filtered = filtered.filter(val => val !== 0);
      while (filtered.length < 4) filtered.push(0);

      if (direction === "down") filtered.reverse();

      for (let row = 0; row < 4; row++) {
        if (board[row][col] !== filtered[row]) {
          moved = true;
          board[row][col] = filtered[row];
        }
      }
    }
  }

  if (moved) {
    generateTile();
    checkGameOver();
  }
}

// Function to check if the game is over or if the player has won
function checkGameOver() {
  const hasEmptySpaces = board.some(row => row.includes(0));
  if (!hasEmptySpaces) {
    alert("Game Over! Final Score: " + score);
    board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    score = 0;
    updateBoard();
  }
}

// Handling keyboard input for tile movement
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") move("left");
  if (e.key === "ArrowRight") move("right");
  if (e.key === "ArrowUp") move("up");
  if (e.key === "ArrowDown") move("down");
});

generateTile(); // Start the game with a tile
