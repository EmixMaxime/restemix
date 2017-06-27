function BadRequestError (msg) {
  this.name = 'BadRequestError'
  this.message = msg
  this.stack = (new Error()).stack
}
BadRequestError.prototype = Object.create(Error.prototype)
BadRequestError.prototype.constructor = BadRequestError

module.exports = BadRequestError