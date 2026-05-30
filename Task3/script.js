document.addEventListener('DOMContentLoaded', function () {
  var grid = document.getElementById('grid');
  var resetBtn = document.getElementById('reset');
  var totalShips = 5;
  var maxClicks = 8;
  var shipPositions = [];
  var shipsFound = 0;
  var clicks = 0;

  function shuffleList(list) {
    for (var i = list.length - 1; i > 0; i--) {
      var randomIndex = Math.floor(Math.random() * (i + 1));
      var temp = list[i];
      list[i] = list[randomIndex];
      list[randomIndex] = temp;
    }
  }

  function startGame() {
    grid.innerHTML = '';
    shipPositions = [];
    shipsFound = 0;
    clicks = 0;

    var numbers = [];
    for (var i = 0; i < 16; i++) {
      numbers.push(i);
    }

    shuffleList(numbers);
    shipPositions = numbers.slice(0, totalShips);

    for (var j = 0; j < 16; j++) {
      var box = document.createElement('div');
      box.className = 'cell';
      box.dataset.index = j;
      box.addEventListener('click', cellClick);
      grid.appendChild(box);
    }
  }

  function cellClick(event) {
    var box = event.currentTarget;

    if (box.classList.contains('revealed')) {
      return;
    }

    var index = Number(box.dataset.index);
    var shipFound = shipPositions.indexOf(index) !== -1;

    if (shipFound) {
      box.classList.add('revealed');
      box.classList.add('ship');
      shipsFound++;
    } else {
      box.classList.add('revealed');
      box.classList.add('water');
    }

    clicks++;

    if (shipsFound === totalShips) {
      if (clicks <= maxClicks) {
        alert('You Won!');
      } else {
        alert('You Lost!');
      }
      stopGame();
      return;
    }

    if (clicks >= maxClicks && shipsFound < totalShips) {
      alert('You Lost!');
      stopGame();
    }
  }

  function stopGame() {
    var cells = document.querySelectorAll('.cell');
    for (var i = 0; i < cells.length; i++) {
      cells[i].removeEventListener('click', cellClick);
    }
  }

  resetBtn.addEventListener('click', startGame);
  startGame();
});