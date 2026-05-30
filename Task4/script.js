const boardCells = Array.from(document.querySelectorAll('.cell'));
const messageBox = document.getElementById('winner');
const resetButton = document.getElementById('reset');

let board = Array(9).fill('');
let currentPlayer = 'X';
let gameOver = false;

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function showMessage(text) {
  messageBox.textContent = text;
}

function checkWinner() {
  for (const line of winningLines) {
    const first = line[0];
    const second = line[1];
    const third = line[2];

    if (board[first] && board[first] === board[second] && board[second] === board[third]) {
      gameOver = true;
      boardCells[first].classList.add('win');
      boardCells[second].classList.add('win');
      boardCells[third].classList.add('win');
      showMessage(currentPlayer + ' wins!');
      return true;
    }
  }

  if (board.every(value => value !== '')) {
    gameOver = true;
    showMessage('It\'s a tie!');
    return true;
  }

  return false;
}

function playMove(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.index);

  if (board[index] !== '' || gameOver) {
    return;
  }

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;

  if (currentPlayer === 'X') {
    cell.classList.add('x');
  } else {
    cell.classList.remove('x');
  }

  if (checkWinner()) {
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function resetGame() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  gameOver = false;

  boardCells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('win');
    cell.classList.remove('x');
  });

  showMessage('');
}

boardCells.forEach(cell => {
  cell.addEventListener('click', playMove);
});

resetButton.addEventListener('click', resetGame);
