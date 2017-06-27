const _includes = require('lodash/includes')
const { request: requestFactory } = require('fhttp')

const { RestCursor, GetRestCursor } = require('./restCursors')
const sort = require('./cursors/sort')
const limit = require('./cursors/limit')

const request = requestFactory()

const restCursor = RestCursor({ sort: sort({ _includes, request }), limit: limit({ request })  })
const getRestCursor = GetRestCursor({ restCursor })

module.exports = {
  getRestCursor, restCursor,
  GetRestCursor, RestCursor
};
