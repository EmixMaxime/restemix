function CannotError (msg) {
  this.name = 'CannotError';
  this.message = msg,
  this.stack = (new Error()).stack;
}
CannotError.prototype = Object.create(Error.prototype);
CannotError.prototype.constructor = CannotError;

module.exports = CannotError;