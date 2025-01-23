const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

function updateDisplay() {
    const display = document.querySelector('.calculator__display');
    display.textContent = calculator.displayValue;
}

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue; 
    }

    updateDisplay();
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) return;
    
    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }

    updateDisplay();
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand == null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;

    updateDisplay();
}

function calculate(firstOperand, secondOperand, operator) {
    if (operator === 'add') {
        return firstOperand + secondOperand;
    } else if (operator === 'subtract') {
        return firstOperand - secondOperand;
    } else if (operator === 'multiply') {
        return firstOperand * secondOperand;
    } else if (operator === 'divide') {
        return firstOperand / secondOperand;
    }

    return secondOperand;
}

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;

    updateDisplay();
}

const keys = document.querySelector('.calculator__keys');
keys.addEventListener('click', (event) => {
    const { target } = event;

    if (!target.matches('button')) {
        return;
    }

    const { action } = target.dataset;
    const { value } = target;

    switch (action) {
        case 'add':
        case 'subtract':
        case 'multiply':
        case 'divide':
            handleOperator(action);
            break;
        case 'decimal':
            inputDecimal(value);
            break;
        case 'clear':
            resetCalculator();
            break;
        case 'calculate':
            handleOperator(calculator.operator);
            calculator.waitingForSecondOperand = false;
            break;
        default:
            inputDigit(value);
            break;
    }
});