'use strict';

const terminal = require('terminal-kit').terminal;
const stdin = process.stdin;
const Cursor = require('./cursor');
const Display = require('./display');
const Calculator = require('./calculator');
const calculatorTemplate =
`
+-----------------------+
|                       |
+-----+-----+-----+-----+
|  7  |  8  |  9  |  /  |
+-----+-----+-----+-----+
|  4  |  5  |  6  |  *  |
+-----+-----+-----+-----+
|  1  |  2  |  3  |  -  |
+-----+-----+-----+-----+
|  0  |  .  |  +  |  =  |
+-----+-----+-----+-----+
`;

stdin.setRawMode(true);
stdin.on('data', (buffer) => {
   // Ctrl-C handler
   const data = buffer.toString('hex');
   if (data === '03') {
      terminal.hideCursor(false);
      process.exit(1);
   }
});

terminal.hideCursor();
terminal.bgBlack();
terminal.white();
terminal.fullscreen();
terminal(calculatorTemplate);
terminal.moveTo(1, 1);

const cursor = new Cursor(stdin, terminal);
const display = new Display(terminal);
const calculator = new Calculator(cursor, display);
calculator.listenToInput();
