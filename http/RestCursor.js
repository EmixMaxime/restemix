const RestCursor = function () {

  return (req, cursor) => ({
    limit () {
      if (!req.query.limit) return restCursor(req, cursor);
      const limit = { limit: parseInt(req.query.limit) };

      return restCursor(req, Object.assign({}, cursor, limit));
    },

    get: () => cursor
  });

};

const restCursor = RestCursor();

const GetRestCursor = function ({ RestCursor }) {
  const restCursor = RestCursor();
  return (req) => {
    return (action) => {
      switch (action) {
        case 'index':
          return restCursor(req).limit().get();
          break;
      }
    }
  }
};

const getRestCursor = GetRestCursor({ restCursor });

module.exports = {
  getRestCursor, restCursor,
  GetRestCursor, RestCursor
};
