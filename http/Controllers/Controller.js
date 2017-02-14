// export const getResourceName = (originalUrl) => {
//   const resourcePath = originalUrl.match(/\/\w+/)[0]; // Match the first series of characters
//
//   return resourcePath.replace(/^\//, ''); // le ^ doit être devant pour marcher
// }

// getModel et getSchemaObject sont injectés dans RestController de l'application ;-)
const Controller = ({ getRestFilters, getRestCursor, getResourceName, updateDatabase, fillSchema, Cancan }, getModel, getSchemaObject, getPolicy) => {

  const buildQuery = function (query, restCursor, cursorSetters) {
    cursorSetters.forEach(cursorSetter => {
      const value = restCursor[cursorSetter];
      query[cursorSetter](value);
    });
  };

  const failedReason = {
    can: false, // The user can't processing this query !
  }

  return {
    index (req, callback) {
      const restFilter = getRestFilters(req)('index');
      const restCursor = getRestCursor(req)('index'); // { limit: 5, sort: { price: -1 } }
      const cursorSetters = Object.keys(restCursor); // [limit, sort]

      const resource = getResourceName(req);
      const cancan = Cancan(getPolicy(resource)); // Okay, on travaille avec cette politique qui est lié à la resource de la requête
      const model = getModel(resource);

      const user = req.jwt;

      // Prepare the query with the cursor setters (limit, sort)
      // The first {} it will be the where clause (?where:price>5)
      // It will come in the future version (not now!)
      let q = model.find({}, restFilter);
      buildQuery(q, restCursor, cursorSetters);


      q.exec((err, data) => {
        if (!cancan(user)('index')(data)) return callback(null, null, failedReason.can);
        
        if (err) return callback(err, null);
        if (data === null) return callback(null, null);
        return callback(null, data);
      });

    },
    show (req, callback) {
      const restFilter = getRestFilters(req)('show');
      const restCursor = getRestCursor(req)('show');
      const cursorSetters = Object.keys(restCursor); // [limit, sort]
      
      const resource = getResourceName(req);
      const cancan = Cancan(getPolicy(resource)); // Okay, on travaille avec cette politique qui est lié à la resource de la requête
      const model = getModel(resource);

      const user = req.jwt;

      let q = model.findOne({}, restFilter);
      buildQuery(q, restCursor, cursorSetters);;

      q.exec((err, data) => {
        if (!cancan(user)('show')(data)) return callback(null, null, failedReason.can);

        if (err) return callback(err, null, null);
        if (data === null) return callback(null, null, null);
        return callback(null, data, null);
      });

    },

    update (req, callback) {
      const resource = getResourceName(req);
      const model = getModel(resource);
      const schemaObject = getSchemaObject(resource);

      const body =  fillSchema(schemaObject)(req.body);
      const filter = { slug: req.params[resource] };

      model.findOne(filter, (err, data) => {
        // The user can to that ?
      });

      // updateDatabase(Model, filter, body, (err, data) => {
      // const error = controller.mongoErrors.verify(err);
      // if (error) return res.sendStatus(400);
    
      // return res.status(200).json(data);
    }
  }
};

module.exports = Controller;