function RestEmixException () {
  this.name = 'RestEmixException';
  this.message = 'Ops, something went wrong',
  this.stack = (new Error()).stack;
}
RestEmixException.prototype = Object.create(Error.prototype);
RestEmixException.prototype.constructor = RestEmixException;

module.exports = RestEmixException;