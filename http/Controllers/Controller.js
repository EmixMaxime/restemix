// export const getResourceName = (originalUrl) => {
//   const resourcePath = originalUrl.match(/\/\w+/)[0]; // Match the first series of characters
//
//   return resourcePath.replace(/^\//, ''); // le ^ doit être devant pour marcher
// }

// getModel et getSchemaObject sont injectés dans RestController de l'application ;-)
const Controller = ({ getRestFilters, getRestCursor, getResourceName, updateDatabase, fillSchema }, getModel, getSchemaObject) => {

  return {
    index (req, callback) {
      const restFilter = getRestFilters(req)('index');
      const resource = getResourceName(req);
      const model = getModel(resource);

      model.find({}, restFilter, (err, data) => {
        if (err) return callback(err, null);
        if (data === null) return callback(null, null);
        return callback(null, data);
      });

    },
    show (req, callback) {
      const restFilter = getRestFilters(req)('show');
      const resource = getResourceName(req);
      const model = getModel(resource);

      model.findOne({}, restFilter, (err, data) => {
        if (err) return callback(err, null);
        if (data === null) return callback(null, null);
        return callback(null, data);
      });

    }
  }
};

module.exports = Controller;
