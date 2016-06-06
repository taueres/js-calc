module.exports = Calculator;

const convertToFloat = function (strValue) {
   if (strValue === '' || strValue === '.') {
      return 0;
   }
   return parseFloat(strValue);
};

const STATUS_FIRST_OPERAND = 1;
const STATUS_SECOND_OPERAND = 3;
const STATUS_RESULT = 4;

function Calculator(cursor, display) {
   this.cursor = cursor;
   this.display = display;

   this.operation = '';
   this.result = 0;
   this.clear();

   cursor.on('symbol.selected', this.onSymbol.bind(this));
}

Calculator.prototype.onSymbol = function (symbol) {
   switch (symbol) {
      case '+':
      case '-':
      case '*':
      case '/':

         if (this.status === STATUS_RESULT) {
            this.clear();
            this.firstOperand = this.result;
         }

         if (this.status === STATUS_SECOND_OPERAND) {
            this.execute();
            this.clear();
            this.firstOperand = this.result;
         }

         this.operation = symbol;
         this.status = STATUS_SECOND_OPERAND;
         this.isDecimal = false;
         this.display.setData(symbol);
         return;
   }

   if (symbol === '=') {
      if (this.status === STATUS_RESULT) {
         this.firstOperand = this.result;
      }

      this.execute();
      return;
   }

   if (this.status === STATUS_RESULT) {
      this.clear();
   }

   if (symbol === '.') {
      if (this.isDecimal) {
         // Invalid input, discard
         return;
      }

      this.isDecimal = true;
   }

   if (this.status === STATUS_FIRST_OPERAND) {
      this.firstOperand += symbol;
   }

   if (this.status === STATUS_SECOND_OPERAND) {
      this.secondOperand += symbol;
   }

   this.updateDisplay();
};

Calculator.prototype.updateDisplay = function () {
   if (this.status === STATUS_FIRST_OPERAND) {
      this.display.setData(this.firstOperand);
   }

   if (this.status === STATUS_SECOND_OPERAND) {
      this.display.setData(this.secondOperand);
   }

   if (this.status === STATUS_RESULT) {
      this.display.setData(this.result);
   }
};

Calculator.prototype.execute = function () {
   const first = convertToFloat(this.firstOperand);
   const second = convertToFloat(this.secondOperand);
   switch (this.operation) {
      case '+':
         this.result = first + second;
         break;
      case '-':
         this.result = first - second;
         break;
      case '*':
         this.result = first * second;
         break;
      case '/':
         this.result = first / second;
         break;
   }
   this.status = STATUS_RESULT;
   this.updateDisplay();
};

Calculator.prototype.clear = function () {
   this.firstOperand = '';
   this.secondOperand = '';

   this.status = STATUS_FIRST_OPERAND;
   this.isDecimal = false;
};
