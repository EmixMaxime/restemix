/**
 * Update the Mongo database, is a shortcut for findOneAndUpdate
 * @param  {} Model
 * @param  {} filter
 * @param  {} data
 * @param  {} callback
 */
const updateDatabase = (Model, filter, data, callback) =>
  Model.findOneAndUpdate(
    filter,
    { $set: data },
    { new: true },
    callback
  );

module.exports = updateDatabase;
