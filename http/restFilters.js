const RestFilters = function ({ projection }) {
  const restFilters = (req, filters = {}) => ({
    projection () {
      return restFilters(req, Object.assign({}, filters, projection()))
    },
    get: () => filters,
  })

}

const GetRestFilters = function ({ restFilters }) {
  return (req) => {
    return (action) => {
      switch (action) {
        case 'index':
        case 'show':
          return restFilters(req).projection().get()
      }
    }
  }
}

module.exports = { RestFilters, GetRestFilters }