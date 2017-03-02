function NotFound (msg) {
  this.name = 'NotFound';
  this.message = msg || 'Not Found', 
  this.stack = (new Error()).stack;
}

NotFound.prototype = Object.create(Error.prototype);
NotFound.prototype.constructor = NotFound;

module.exports = NotFound;
