const cells = Array.from(document.querySelectorAll('.cell'));
const winnerEl = document.getElementById('winner');
const resetBtn = document.getElementById('reset');

let board = Array(9).fill(null);
let clickCount = 0;
let winner = null;

const winCombos = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function updateWinnerDisplay(text){
  winnerEl.textContent = text || '';
}

function checkWin(){
  for(const combo of winCombos){
    const [a,b,c] = combo;
    if(board[a] && board[a] === board[b] && board[b] === board[c]){
      winner = board[a];
      cells[a].classList.add('win');
      cells[b].classList.add('win');
      cells[c].classList.add('win');
      updateWinnerDisplay(`${winner} wins!`);
      return true;
    }
  }
  // tie detection
  if(board.every(v => v !== null)){
    updateWinnerDisplay('It\'s a tie!');
    return false;
  }
  return false;
}

function handleCellClick(e){
  const idx = Number(e.currentTarget.dataset.index);
  if(board[idx] || winner) return; // ignore if already set or game over

  clickCount++;
  const mark = (clickCount % 2 === 1) ? 'X' : 'O';
  board[idx] = mark;
  e.currentTarget.textContent = mark;

  checkWin();
}

function reset(){
  board.fill(null);
  clickCount = 0;
  winner = null;
  cells.forEach(c => { c.textContent = ''; c.classList.remove('win'); });
  updateWinnerDisplay('');
}

cells.forEach(c => c.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', reset);
