const BOARD_SIZE = 10;
const NUMBER_OF_MINES = 10;

let board = document.getElementById('board');
let cells = [];
let mines = [];
let isGameOver = false;

function createBoard() {
  for (let i = 0; i < BOARD_SIZE; i++) {
    let row = [];
    for (let j = 0; j < BOARD_SIZE; j++) {
      let cell = document.createElement('div');
      cell.classList.add('cell');
      cell.setAttribute('data-row', i);
      cell.setAttribute('data-col', j);
      cell.addEventListener('click', handleCellClick);
      cell.addEventListener('contextmenu', handleCellRightClick);
      board.appendChild(cell);
      row.push({
        element: cell,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        row: i,
        col: j
      });
    }
    cells.push(row);
  }
}

function plantMines() {
  let plantedMines = 0;
  while (plantedMines < NUMBER_OF_MINES) {
    let row = Math.floor(Math.random() * BOARD_SIZE);
    let col = Math.floor(Math.random() * BOARD_SIZE);
    if (!cells[row][col].isMine) {
      cells[row][col].isMine = true;
      mines.push(cells[row][col]);
      plantedMines++;
    }
  }
}

function handleCellClick(event) {
  if (isGameOver) {
    return;
  }
  let cell = event.target;
  let row = parseInt(cell.getAttribute('data-row'));
  let col = parseInt(cell.getAttribute('data-col'));
  if (cells[row][col].isFlagged || cells[row][col].isRevealed) {
    return;
  }
  if (cells[row][col].isMine) {
    gameOver();
  } else {
    revealCell(cells[row][col]);
    checkWin();
  }
}

function handleCellRightClick(event) {
  event.preventDefault();
  if (isGameOver) {
    return;
  }
  let cell = event.target;
  let row = parseInt(cell.getAttribute('data-row'));
  let col = parseInt(cell.getAttribute('data-col'));
  if (cells[row][col].isRevealed) {
    return;
  }
  if (cells[row][col].isFlagged) {
    cells[row][col].isFlagged = false;
    cell.classList.remove('flagged');
  } else {
    cells[row][col].isFlagged = true;
    cell.classList.add('flagged');
  }
}

function revealCell(cell) {
  cell.isRevealed = true;
  cell.element.classList.add('revealed');
  if (cell.isMine) {
    cell.element.classList.add('mine');
  } else {
    let count = countNeighboringMines(cell);
    if (count > 0) {
      cell.element.textContent = count;
    } else {
      revealNeighboringCells(cell);
    }
  }
}

function revealNeighboringCells(cell) {
  let neighbors = getNeighboringCells(cell);
  for (let i = 0; i < neighbors.length; i++) {
    if (!neighbors[i].isMine && !neighbors[i].isRevealed && !neighbors[i].isFlagged) {
      revealCell(neighbors[i]);
    }
  }
}

function countNeighboringMines(cell) {
  let count = 0;
  let neighbors = getNeighboringCells(cell);
  for (let i = 0; i < neighbors.length; i++) {
    if (neighbors[i].isMine) {
      count++;
    }
  }
  return count;
}

function getNeighboringCells(cell) {
  let neighbors = [];
  let row = cell.row;
  let col = cell.col;
  for (let i = Math.max(row - 1, 0); i <= Math.min(row + 1, BOARD_SIZE - 1); i++) {
    for (let j = Math.max(col - 1, 0); j <= Math.min(col + 1, BOARD_SIZE - 1); j++) {
      if (i !== row || j !== col) {
        neighbors.push(cells[i][j]);
      }
    }
  }
  return neighbors;
}

function checkWin() {
  let nonMineCells = BOARD_SIZE * BOARD_SIZE - NUMBER_OF_MINES;
  let revealedNonMineCells = 0;
  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[i].length; j++) {
      if (!cells[i][j].isMine && cells[i][j].isRevealed) {
        revealedNonMineCells++;
      }
    }
  }
  if (revealedNonMineCells === nonMineCells) {
    win();
  }
}

function gameOver() {
  isGameOver = true;
  for (let i = 0; i < mines.length; i++) {
    mines[i].element.classList.add('mine');
  }
  alert('游戏结束，你输了！');
}

function win() {
  isGameOver = true;
  alert('恭喜你，你赢了！');
}

createBoard();
plantMines();
