// export const getResourceName = (originalUrl) => {
//   const resourcePath = originalUrl.match(/\/\w+/)[0]; // Match the first series of characters
//
//   return resourcePath.replace(/^\//, ''); // le ^ doit être devant pour marcher
// }

// getModel et getSchemaObject sont injectés dans RestController de l'application ;-)
const Controller = ({ getRestFilters, getRestCursor, getResourceName, fillSchema, CanCan }, getModel, getSchemaObject, getPolicy) => {

  // Validate the dependencies needs to be function
  const functionDeps = { getRestFilters, getRestCursor, getResourceName, fillSchema, CanCan, getModel, getSchemaObject, getPolicy };
  Object.keys(functionDeps).forEach(dep => {
    if (typeof functionDeps[dep] !== 'function') throw new Error(`${dep} must be a function ! But it's a ${typeof dep}`);
  });

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
      const cancan = CanCan(getPolicy(resource)); // Okay, on travaille avec cette politique qui est lié à la resource de la requête
      const model = getModel(resource);

      const user = req.jwt;

      // Prepare the query with the cursor setters (limit, sort)
      // The first {} it will be the where clause (?where:price>5)
      // It will come in the future version (not now!)
      let q = model.find({}, restFilter);
      buildQuery(q, restCursor, cursorSetters);


      q.exec((err, data) => {
        if (cancan(user)('index')(data) === false) return callback(null, null, cannot);
        
        if (err) return callback(err, null, null);
        if (data === null) return callback(null, null, null);
        return callback(null, data, null);
      });

    },
    show (req, callback) {
      const restFilter = getRestFilters(req)('show');
      const resource = getResourceName(req);
      const cancan = CanCan(getPolicy(resource)); // Okay, on travaille avec cette politique qui est lié à la resource de la requête
      const model = getModel(resource);
      const user = req.jwt;

      const query = { slug: req.params[resource] };

      // db.collection.findOne(query, projection) restFilter = projection
      const q = model.findOne(query, restFilter);
      q.exec((err, data) => {
        if (cancan(user)('show')(data) === false) return callback(null, null, cannot);
        if (err) return callback(err, null, null);
        if (data === null) return callback(null, null, null);

        return callback(null, data, null);
      });

    },

    update (req, callback) {
      const resource = getResourceName(req);
      const model = getModel(resource);
      const schemaObject = getSchemaObject(resource);
      const cancan = CanCan(getPolicy(resource));
      const user = req.jwt;
      
      const body =  fillSchema(schemaObject)(req.body);
      const query = { slug: req.params[resource] };

      model.findOne(query, (err, data) => {
        if (cancan(user)('update')(data) === false) return callback(null, null, cannot);
        if (err) return callback(err, null, null);
        if (data === null) return callback(null, null, null);
        
        // Update with new data
        data = Object.assign({}, data, body);
        data.save((err, updatedData) => {
          if (err) return callback(err, null, null);
          return callback(null, updatedData, null);
        });

      });

    },

    create (req, callback) {
      const resourceName = getResourceName(req);
      const model = getModel(resourceName);
      const schemaObject = getSchemaObject(resourceName);
      const cancan = CanCan(getPolicy(resourceName));
      const user = req.jwt;

      const body = fillSchema(schemaObject)(req.body);
      if (cancan(user)('create')() === false) return callback(null, null, cannot); // TODO: peut poser problème

      model.create(body, (err, data) => {
        if (err) return callback(err, null, null);
        return callback(null, data, null);
      });
      
    },

    delete (req, callback) {
      const resource = getResourceName(req);
      const model = getModel(resource);
      const cancan = CanCan(getPolicy(resource));
      const user = req.jwt;
      
      const query = { slug: req.params[resource] };

      model.findOne(query, (err, data) => {
        if (cancan(user)('delete')(data) === false) return callback(null, null, cannot);
        if (err) return callback(err, null, null);
        if (data === null) return callback(null, null, null);
        
        data.remove((err) => {
          if (err) return callback(err, null, null);
          return callback(null, true, null);
        });
      });
    }
  }
};

module.exports = Controller;