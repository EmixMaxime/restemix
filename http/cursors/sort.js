const BadRequestError = require('../BadRequestError')

// GET  https://emixmaxime.com/books?sort=title,author&desc=title&asc=author
const sort = ({ _includes, request }, req) => {
  const Request = request(req)
  const { sort: sortQuery, desc: descQuery, asc: ascQuery } = Request.getQueries() || {}

  if (!sortQuery) return {}

  // Just in case... But query it's always a string no?
  if (typeof sortQuery !== 'string') throw new BadRequestError(`sort query must be a string, but it's a ${typeof sortQuery}`)
  if (descQuery !== undefined && typeof descQuery !== 'string') throw new BadRequestError(`desc query must be a string, but it's a ${typeof descQuery}`)
  if (ascQuery !== undefined && typeof ascQuery !== 'string') throw new BadRequestError(`asc query must be a string, but it's a ${typeof ascQuery}`)

  const descFields = descQuery !== undefined ? descQuery.split(',') : []
  const ascFields = ascQuery !== undefined ? ascQuery.split(',') : []

  // Un champ ne peut pas être dans desc et asc -> erreur de requête
  // Un champ doit être dans sort si il est dans asc|desc
  descFields.forEach(d => {
    if (!_includes(sortQuery, d)) throw new BadRequestError('Desc query must be into sort query')
    ascFields.forEach(a => {
      if (!_includes(sortQuery, a)) throw new BadRequestError('Asc query must be into sort query')
      if (d === a) throw new BadRequestError('Desc fields query can\'t be into asc fields query')
    })
  })

  // Gestion du desc
  const descRequest = descFields.reduce((acc, field) => {
    acc[field] = -1
    return acc
  }, {})

  // Gestion du asc
  const ascRequest = ascFields.reduce((acc, field) => {
    acc[field] = 1
    return acc
  }, {})

  // Je ne peux pas avoir de collision à ce stade, j'ai vérifier que les champs ne sont pas dans asc & desc
  return { sort: Object.assign({}, descRequest, ascRequest) }
}

module.exports = deps => sort.bind(null, deps)