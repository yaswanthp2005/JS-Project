// Calculator logic for Task 6
const display = document.getElementById('display');
const keys = document.querySelector('.keys');

let firstOperand = null;
let operator = null;
let waitingForSecond = false;
let justCalculated = false;

keys.addEventListener('click', (e) => {
  const button = e.target.closest('button');
  if (!button) return;

  if (button.classList.contains('number')) {
    handleNumber(button.textContent.trim());
    return;
  }

  const action = button.dataset.action;
  switch(action){
    case 'clear': handleClear(); break;
    case 'delete': handleDelete(); break;
    case 'percent': handleOperator('%'); break;
    case 'exp': handleOperator('Exp'); break;
    case 'operator': handleOperator(button.textContent.trim()); break;
    case 'equals': handleEquals(); break;
  }
});

function handleNumber(num){
  if (justCalculated){
    display.textContent = num === '.' ? '0.' : num;
    justCalculated = false;
    firstOperand = null;
    operator = null;
    waitingForSecond = false;
    return;
  }

  if (waitingForSecond){
    // start entering second operand
    display.textContent = (num === '.') ? '0.' : num;
    waitingForSecond = false;
    return;
  }

  if (num === '.'){
    if (display.textContent.includes('.')) return;
    display.textContent += '.';
    return;
  }

  if (display.textContent === '0'){
    display.textContent = num;
  } else {
    display.textContent += num;
  }
}

function handleOperator(op){
  // If there's an existing operator and user didn't enter second number, allow operator change
  if (firstOperand !== null && waitingForSecond){
    operator = op;
    return;
  }

  firstOperand = parseFloat(display.textContent);
  operator = op;
  waitingForSecond = true;
  justCalculated = false;
  display.textContent = '0';
}

function handleEquals(){
  if (operator === null || firstOperand === null) return;
  const second = parseFloat(display.textContent);
  let result = 0;

  switch(operator){
    case '+': result = firstOperand + second; break;
    case '-': result = firstOperand - second; break;
    case '×':
    case 'x': result = firstOperand * second; break;
    case '÷': result = firstOperand / second; break;
    case '%': result = firstOperand % second; break;
    case 'Exp': result = Math.pow(firstOperand, second); break;
    default: result = second; break;
  }

  display.textContent = String(result);
  firstOperand = null;
  operator = null;
  waitingForSecond = false;
  justCalculated = true;
}

function handleClear(){
  display.textContent = '0';
  firstOperand = null;
  operator = null;
  waitingForSecond = false;
  justCalculated = false;
}

function handleDelete(){
  if (justCalculated){
    handleClear();
    return;
  }
  let txt = display.textContent;
  if (txt.length <= 1){
    display.textContent = '0';
    return;
  }
  display.textContent = txt.slice(0, -1);
}
