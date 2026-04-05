let currentDisplay = '0';
let currentOperator = null;
let previousOperand = null;
let awaitingNextOperand = false;
const displayElement = document.getElementById('display');
function updateDisplay() { 
    let displayStr = String(currentDisplay);
    if (displayStr.length > 12) {
        
        if (displayStr.includes('.')) {
             displayStr = parseFloat(currentDisplay).toPrecision(12);
        } else {
             displayStr = parseFloat(currentDisplay).toExponential(6);
        }
    }
    displayElement.textContent = displayStr;
}
function clearDisplay() {
    currentDisplay = '0';
    currentOperator = null;
    previousOperand = null;
    awaitingNextOperand = false;
    updateDisplay();
}
function appendNumber(number) {
    if (awaitingNextOperand) {
        currentDisplay = number;
        awaitingNextOperand = false;
    } else {
        if (currentDisplay === '0' && number !== '.') {
            currentDisplay = number;
        } else {
            if (number === '.' && currentDisplay.includes('.')) return;
            currentDisplay += number;
        }
    }
    updateDisplay();
}
function appendOperator(operator) {
    if (currentOperator !== null && !awaitingNextOperand) {
        calculate();
    }
    previousOperand = parseFloat(currentDisplay);
    currentOperator = operator;
    awaitingNextOperand = true;
}
function calculate() {
    if (currentOperator === null || awaitingNextOperand) return;
    
    let result;
    const currentOperand = parseFloat(currentDisplay);
    
    switch (currentOperator) {
        case '+':
            result = previousOperand + currentOperand;
            break;
        case '-':
            result = previousOperand - currentOperand;
            break;
        case '*':
            result = previousOperand * currentOperand;
            break;
        case '/':
            if (currentOperand === 0) {
                result = 'Error';
                currentDisplay = result;
                currentOperator = null;
                previousOperand = null;
                awaitingNextOperand = true;
                displayElement.textContent = currentDisplay;
                return;
            } else {
                result = previousOperand / currentOperand;
            }
            break;
        default:
            return;
    }
    result = Math.round(result * 1000000000) / 1000000000;
    
    currentDisplay = String(result);
    currentOperator = null;
    previousOperand = null;
    awaitingNextOperand = true;
    updateDisplay();
}
document.addEventListener('keydown', (event) => {
    if (event.key >= '0' && event.key <= '9' || event.key === '.') {
        appendNumber(event.key);
    } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        appendOperator(event.key);
    } else if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        calculate();
    } else if (event.key === 'Escape' || event.key === 'Backspace' || event.key === 'c') {
        clearDisplay();
    }
});
