function NotFoundException (msg) {
  this.name = 'NotFoundException';
  this.message = msg || 'Not Found', 
  this.stack = (new Error()).stack;
}

NotFoundException.prototype = Object.create(Error.prototype);
NotFoundException.prototype.constructor = NotFoundException;

module.exports = NotFoundException;
