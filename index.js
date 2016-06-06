'use strict';

const terminal = require('terminal-kit').terminal;

const stdin = process.stdin;
const Cursor = require('./cursor');
const Display = require('./display');
const Calculator = require('./calculator');

stdin.setRawMode(true);

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

terminal.hideCursor();
terminal.bgBlack();
terminal.white();
terminal.fullscreen();
terminal(calculatorTemplate);
terminal.moveTo(1, 1);

var cursor = new Cursor(stdin, terminal);
var display = new Display(terminal);
var calculator = new Calculator(cursor, display);

stdin.on('data', function (buffer) {
   var x = buffer.toString('hex');

   if (x === '03') {
      terminal.hideCursor(false);
      process.exit(1);
   }

   //console.log(x);
});
