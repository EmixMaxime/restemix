function CannotException (msg) {
  this.name = 'CannotException';
  this.message = msg,
  this.stack = (new Error()).stack;
}
CannotException.prototype = Object.create(Error.prototype);
CannotException.prototype.constructor = CannotException;

module.exports = CannotException;