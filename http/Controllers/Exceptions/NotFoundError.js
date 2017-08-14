function NotFoundError (msg) {
  this.name = 'NotFoundError';
  this.message = msg || 'Not Found Error',
  this.status = 404
  this.stack = (new Error()).stack;
}

NotFoundError.prototype = Object.create(Error.prototype);
NotFoundError.prototype.constructor = NotFoundError;

module.exports = NotFoundError;
