const screen = document.getElementById('display');
const buttons = document.querySelector('.keys');

let firstNumber = null;
let currentOperator = null;
let waitForSecondNumber = false;
let answerShown = false;

buttons.addEventListener('click', function (event) {
  const clickedButton = event.target.closest('button');

  if (!clickedButton) {
    return;
  }

  if (clickedButton.classList.contains('number')) {
    typeNumber(clickedButton.textContent.trim());
    return;
  }

  const action = clickedButton.dataset.action;

  if (action === 'clear') {
    clearScreen();
    return;
  }

  if (action === 'delete') {
    deleteLast();
    return;
  }

  if (action === 'percent') {
    setOperator('%');
    return;
  }

  if (action === 'exp') {
    setOperator('Exp');
    return;
  }

  if (action === 'operator') {
    setOperator(clickedButton.textContent.trim());
    return;
  }

  if (action === 'equals') {
    showAnswer();
  }
});

function typeNumber(value) {
  if (answerShown) {
    screen.textContent = value === '.' ? '0.' : value;
    firstNumber = null;
    currentOperator = null;
    waitForSecondNumber = false;
    answerShown = false;
    return;
  }

  if (waitForSecondNumber) {
    screen.textContent = value === '.' ? '0.' : value;
    waitForSecondNumber = false;
    return;
  }

  if (value === '.') {
    if (screen.textContent.indexOf('.') !== -1) {
      return;
    }

    screen.textContent = screen.textContent + '.';
    return;
  }

  if (screen.textContent === '0') {
    screen.textContent = value;
    return;
  }

  screen.textContent = screen.textContent + value;
}

function setOperator(value) {
  if (firstNumber !== null && waitForSecondNumber) {
    currentOperator = value;
    return;
  }

  firstNumber = Number(screen.textContent);
  currentOperator = value;
  waitForSecondNumber = true;
  answerShown = false;
  screen.textContent = '0';
}

function showAnswer() {
  if (firstNumber === null || currentOperator === null) {
    return;
  }

  const secondNumber = Number(screen.textContent);
  let result = secondNumber;

  if (currentOperator === '+') {
    result = firstNumber + secondNumber;
  } else if (currentOperator === '-') {
    result = firstNumber - secondNumber;
  } else if (currentOperator === '×') {
    result = firstNumber * secondNumber;
  } else if (currentOperator === '÷') {
    result = firstNumber / secondNumber;
  } else if (currentOperator === '%') {
    result = firstNumber % secondNumber;
  } else if (currentOperator === 'Exp') {
    result = Math.pow(firstNumber, secondNumber);
  }

  screen.textContent = String(result);
  firstNumber = null;
  currentOperator = null;
  waitForSecondNumber = false;
  answerShown = true;
}

function clearScreen() {
  screen.textContent = '0';
  firstNumber = null;
  currentOperator = null;
  waitForSecondNumber = false;
  answerShown = false;
}

function deleteLast() {
  if (answerShown) {
    clearScreen();
    return;
  }

  if (screen.textContent.length <= 1) {
    screen.textContent = '0';
    return;
  }

  screen.textContent = screen.textContent.slice(0, -1);
}
