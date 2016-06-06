'use strict';

module.exports = Display;

function Display(terminal) {
   this.terminal = terminal;
   this.data = '';
}

Display.prototype.setData = function (data) {
   this.data = data + '';

   if (this.data.length > 21) {
      this.data = this.data.substr(-21, 21);
   }

   this._display();
};

Display.prototype._display = function () {
   let length = this.data.length;

   const marginRight = 21 - length;

   this.terminal.moveTo(3, 3);
   this.terminal(' '.repeat(marginRight) + this.data);
};
