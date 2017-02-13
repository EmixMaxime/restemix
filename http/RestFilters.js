const RestFilters = function () {

  return (req, filters) => ({

    projectionFields () {
      const fields = {};
      const queryFilters = { includes: req.query.includes || [], excludes: req.query.excludes || [] };

      // if (queryFilters.fields.length > 0 && queryFilters.excludes.length > 0)
      // return res.status(400).json("You can't use fields and excludes parameter")

      const activeFilter = queryFilters.includes.length > 0 ? 'includes' : 'excludes';
      const queryFilter = queryFilters[activeFilter];
      if (queryFilter.length === 0) return restFilters(req, filters);

      const filter = queryFilter.split(',');
      filter.forEach(filter => fields[filter] = activeFilter === 'includes');

      return restFilters(req, Object.assign({}, filters, fields)); // object fields = the filter
    },

    get () {
      return filters;
    }
  });

};

const restFilters = RestFilters();

const GetRestFilters = function ({ restFilters }) {

  return (req) => {
    return (action) => {
      switch (action) {
        case 'index':
          return restFilters(req).projectionFields().get();
          break;
        case 'show':
          return restFilters(req).projectionFields().get();
      }
    }
  }

};

const getRestFilters = GetRestFilters({ restFilters });

module.exports = {
  getRestFilters, restFilters,
  GetRestFilters, RestFilters // For the tests
};
