const { RestFilters, GetRestFilters } = require('./restFilters')
const projection = require('./filters/projection');

const restFilters = RestFilters({ projection })
const getRestFilters = GetRestFilters({ restFilters })

module.exports = {
  getRestFilters, restFilters,
  GetRestFilters, RestFilters // For the tests
}
