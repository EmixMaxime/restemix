function Cannot (msg) {
  this.name = 'Cannot';
  this.message = msg,
  this.stack = (new Error()).stack;
}
Cannot.prototype = Object.create(Error.prototype);
Cannot.prototype.constructor = Cannot;

module.exports = Cannot;