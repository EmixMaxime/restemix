const _includes = require('lodash/includes');

const RestCursor = function ({ _includes }) {

  return (req, cursor) => ({
    limit () {
      if (!req.query.limit) return restCursor(req, cursor);
      const limit = { limit: parseInt(req.query.limit) };

      return restCursor(req, Object.assign({}, cursor, limit));
    },
    // GET  https://emixmaxime.com/books?sort=title,author&desc=title&asc=author
    sort () {
      const sortCursor = {};
      let { sort, desc, asc } = req.query;
      if (!sort) return restCursor(req, cursor);

      desc = desc.split(',');
      asc = asc.split(',');

      // Un champ ne peut pas être dans desc et asc -> erreur de requête
      // Un champ doit être dans sort si il est dans asc|desc
      desc.forEach(d => {
        if (!_includes(sort, d)) throw new Error();
        asc.forEach(a => {
          if (!_includes(sort, a)) throw new Error();
          if (d === a) throw new Error();
        });
      });

      // Gestion du desc
      desc.forEach(d => {
        sortCursor[d] = -1;
      });

      // Gestion du asc
      asc.forEach(a => {
        sortCursor[a] = 1;
      });

      return restCursor(req, Object.assign({}, cursor, sortCursor));
    },

    get: () => cursor
  });

};

const restCursor = RestCursor({ _includes });

const GetRestCursor = function ({ restCursor }) {
  return (req) => {
    return (action) => {
      switch (action) {
        case 'index':
          return restCursor(req).limit().sort().get();
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
