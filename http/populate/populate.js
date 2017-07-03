// Series.find().populate('seasons.episodes').exec()

const populate = ({ request }, req) => {
  const Request = request(req)
  const populateQuery = Request.getQuery('populate')

  // { field: true }
  return projection => {
    
    return populateQuery
      ? { populate: populateQuery }
      : {}
  }

}

module.exports = deps => populate.bind(null, deps)