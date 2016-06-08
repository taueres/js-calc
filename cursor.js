const EventEmitter = require('events');
const util = require('util');

module.exports = Cursor;
util.inherits(Cursor, EventEmitter);

function Cursor(stdin, terminal) {
   EventEmitter.call(this);

   stdin.on('data', this._keyEvent.bind(this));

   this.terminal = terminal;
   this.x = 4;
   this.y = 4;

   this.symbols = {
      '11': '7',
      '12': '8',
      '13': '9',
      '14': '/',
      '21': '4',
      '22': '5',
      '23': '6',
      '24': '*',
      '31': '1',
      '32': '2',
      '33': '3',
      '34': '-',
      '41': '0',
      '42': '.',
      '43': '+',
      '44': '='
   };

   this._paint_cell(this.x, this.y, true);
}

Cursor.prototype._keyEvent = function (data) {
   data = data.toString('hex');

   if (data === '1b5b43') {
      this._move(1, 0);
      return;
   }

   if (data === '1b5b41') {
      this._move(0, -1);
      return;
   }

   if (data === '1b5b44') {
      this._move(-1, 0);
      return;
   }

   if (data === '1b5b42') {
      this._move(0, 1);
      return;
   }

   if (data === '0d') {
      this.emit('symbol.selected', this.getSymbol());
      return;
   }

   // Numeric keypad
   var iData = parseInt(data);
   if (iData && iData >= 30 && iData < 40) {
      this.emit('symbol.selected', iData - 30);
   }

   if (data === '2f') {
      this.emit('symbol.selected', '/');
   }

   if (data === '2a') {
      this.emit('symbol.selected', '*');
   }

   if (data === '2d') {
      this.emit('symbol.selected', '-');
   }

   if (data === '2b') {
      this.emit('symbol.selected', '+');
   }

   if (data === '2e') {
      this.emit('symbol.selected', '.');
   }
};

Cursor.prototype._move = function (delta_x, delta_y) {
   const original_x = this.x
      , original_y = this.y;

   const future_x = this.x + delta_x
      , future_y = this.y + delta_y;

   if (future_x > 4 || future_x < 1) {
      return;
   }

   if (future_y > 4 || future_y < 1) {
      return;
   }

   this._paint_cell(original_x, original_y, false);
   this._paint_cell(future_x, future_y, true);
   this.x = future_x;
   this.y = future_y;
};

Cursor.prototype._paint_cell = function (virtual_x, virtual_y, selected) {
   const real_x = (virtual_x - 1) * 6 + 2;
   const real_y = (virtual_y - 1) * 2 + 5;

   this.terminal.moveTo(real_x, real_y);
   if (selected) {
      this.terminal.bgWhite();
      this.terminal.black();
   } else {
      this.terminal.bgBlack();
      this.terminal.white();
   }
   const s = this._get_symbol(virtual_x, virtual_y);
   this.terminal(`  ${s}  `);
   this.terminal.bgBlack();
   this.terminal.white();
};

Cursor.prototype._get_symbol = function (x, y) {
   return this.symbols[y + '' + x];
};

Cursor.prototype.getSymbol = function () {
   return this._get_symbol(this.x, this.y);
};
