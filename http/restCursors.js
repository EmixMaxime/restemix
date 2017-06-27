const RestCursor = function ({ limit, sort }) {
  const restCursor = (req, cursor = {}) => ({
    limit: () => restCursor(req, Object.assign({}, cursor, limit(req))),

    sort: () => restCursor(req, Object.assign({}, cursor, sort(req))),

    get: () => cursor
  })

  return restCursor
}

const GetRestCursor = function ({ restCursor }) {
  return (req) => {
    return (action) => {
      switch (action) {
        case 'index':
          return restCursor(req).limit().sort().get()
          break
      }
    }
  }
}

module.exports = { RestCursor, GetRestCursor }