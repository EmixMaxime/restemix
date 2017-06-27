const BadRequestError = require('../BadRequestError')

const projection = (req) => {
  const projectionQuery = { includes: req.query.includes || [], excludes: req.query.excludes || [] }

  if (projectionQuery.includes.length > 0 && projectionQuery.excludes.length > 0)
    throw new BadRequestError("You can't use fields and excludes parameter")

  const projectionType = projectionQuery.includes.length > 0 ? 'includes' : 'excludes'
  const queryFilter = projectionQuery[projectionType]

  if (queryFilter.length === 0) return {}

  return queryFilter.split(',').reduce((acc, filter) => {
    acc[filter] = projectionType === 'includes'
    return acc
  }, {})
}

module.exports = projection

