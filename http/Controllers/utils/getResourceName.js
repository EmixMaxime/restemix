/**
 *
 * @param req
 * @example
 * // returns "categories"
 * req.baseUrl = "/categories/php"
 * Rappel : req.baseUrl -> /categories je dois donc enlever le premier /
 */
const getResourceName = req => req.baseUrl.replace(/^\//, '')
module.exports = getResourceName
