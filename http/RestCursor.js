const _includes = require('lodash/includes');

function BadRequestError (msg) {
  this.name = 'BadRequestError';
  this.message = msg;
  this.stack = (new Error()).stack;
}
BadRequestError.prototype = Object.create(Error.prototype);
BadRequestError.prototype.constructor = BadRequestError;

const RestCursor = function ({ _includes }) {

  return (req, cursor = {}) => ({
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

      // Just in case... But query it's always a string no?
      if (typeof sort !== 'string') throw new BadRequestError(`sort query must be a string, but it's a ${typeof sort}`);
      if (desc !== undefined && typeof desc !== 'string') throw new BadRequestError(`desc query must be a string, but it's a ${typeof desc}`);
      if (asc !== undefined && typeof asc !== 'string') throw new BadRequestError(`asc query must be a string, but it's a ${typeof asc}`);

      desc = desc !== undefined ? desc.split(',') : [];
      asc = asc !== undefined ? asc.split(',') : [];

      // Un champ ne peut pas être dans desc et asc -> erreur de requête
      // Un champ doit être dans sort si il est dans asc|desc
      desc.forEach(d => {
        if (!_includes(sort, d)) throw new BadRequestError('Desc query must be into sort query');
        asc.forEach(a => {
          if (!_includes(sort, a)) throw new BadRequestError('Asc query must be into sort query');
          if (d === a) throw new BadRequestError('Desc fields query can\'t be into asc fields query');
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

      return restCursor(req, Object.assign({}, cursor, { sort: sortCursor }));
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
