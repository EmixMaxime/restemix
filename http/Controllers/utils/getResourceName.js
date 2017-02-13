/**
  req url : /categories/php
  return -> categories
 Rappel : req.baseUrl -> /categories je dois donc enlever le premier /
*/
const getResourceName = (req) => req.baseUrl.replace(/^\//, '');
module.exports = getResourceName;
