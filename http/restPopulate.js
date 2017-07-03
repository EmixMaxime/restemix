const p = require('./populate')

const RestPopulate = ({ populate }) => {
  return req => populate(req)
}

module.exports = RestPopulate({ populate: p })
