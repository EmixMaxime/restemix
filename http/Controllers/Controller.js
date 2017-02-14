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

  const cannot = {
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
        if (!cancan(user)('index')(data)) return callback(null, null, cannot);
        
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

      const query = { slug: req.params[resource] };

      // db.collection.findOne(query, projection)
      let q = model.findOne(query, restFilter);
      buildQuery(q, restCursor, cursorSetters);

      q.exec((err, data) => {
        if (!cancan(user)('show')(data)) return callback(null, null, cannot);

        if (err) return callback(err, null, null);
        if (data === null) return callback(null, null, null);
        return callback(null, data, null);
      });

    },

    update (req, callback) {
      const resource = getResourceName(req);
      const model = getModel(resource);
      const schemaObject = getSchemaObject(resource);

      const cancan = Cancan(getPolicy(resource));
      
      const user = req.jwt;
      
      const body =  fillSchema(schemaObject)(req.body);
      const query = { slug: req.params[resource] };

      model.findOne(query, (err, data) => {
        if (!cancan(user)('update')(data)) return callback(null, null, cannot);

        if (err) return callback(err, null, null);
        if (data === null) return callback(null, null, null);
        
        // Update with new data
        data = Object.assign({}, data, body);
        data.save((err, updatedData) => {
          return callback(null, updatedData, null);
        });

      });

    },

    create (req, callback) {
      const resourceName = getResourceName(req);
      const model = getModel(resourceName);

      const schemaObject = getSchemaObject(resourceName);
      
      const cancan = Cancan(getPolicy(resourceName));
      const user = req.jwt;

      const body = fillSchema(schemaObject)(req.body);
      if (!cancan(user)('create')()) return callback(null, null, cannot);

      model.create(body, (err, data) => {
        if (err) return callback(err);
        return callback(null, data);
      });
      
    },

    delete (req, callback) {
      const resource = getResourceName(req);
      const model = getModel(resource);

      const cancan = Cancan(getPolicy(resource));
      const user = req.jwt;
      
      const query = { slug: req.params[resource] };

      model.findOne(query, (err, data) => {
        if (!cancan(user)('delete')(data)) return callback(null, null, cannot);

        if (err) return callback(err, null, null);
        if (data === null) return callback(null, null, null);
        
        data.remove((err) => {
          return callback(null, true, null);
        });
      });
    }
  }
};

module.exports = Controller;