const limit = ({ request }, req) => {
  const Request = request(req);
  const limitQuery = Request.getQuery('limit')
  return limitQuery
    ? { limit: parseInt(req.query.limit) }
    : {}
}

module.exports = deps => limit.bind(null, deps)