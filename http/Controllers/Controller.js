const CannotError = require('./Exceptions/CannotError');
const RestEmixException = require('./Exceptions/RestEmixException');
const NotFoundError = require('./Exceptions/NotFoundError');

// getModel et getSchemaObject sont injectés dans RestController de l'application ;-)
const Controller = ({ getRestFilters, getRestCursor, getResourceName, fillSchema, CanCan, _merge }, getModel, getSchemaObject, getPolicy) => {

  // Validate the dependencies needs to be function
  const functionDeps = { getRestFilters, getRestCursor, getResourceName, fillSchema, CanCan, getModel, getSchemaObject, getPolicy };
  Object.keys(functionDeps).forEach(dep => {
    if (typeof functionDeps[dep] !== 'function') throw new Error(`${dep} must be a function ! But it's a ${typeof dep}`);
  });

  return {

    async index (req, { user } = {}) {
      const restFilters = getRestFilters(req)('index') // e.g: { field: true }
      const restCursors = getRestCursor(req)('index') // e.g: { limit: 5, sort: { price: -1 } }
      const cursorSetters = Object.keys(restCursors) // e.g: [limit, sort]

      const resource = getResourceName(req) // Get the resource name based on the request
      const model = getModel(resource)
      const cancan = CanCan(getPolicy(resource)) // Initialize the cancan library. See: https://github.com/EmixMaxime/cancan 

      // Prepare the query with the cursor setters (limit, sort)
      // The first {} it will be the where clause (?where:price>5)
      // It will come in the future version (not now!)

      /**
       * Call cursor methods with the value
       * e.g: restCursors = { limit: 5, sort: { price: -1 } } -> q.limit(5).sort({ price: -1 })
       */
      const q = model.find({}, restFilters)
      try {
        cursorSetters.forEach(cursorSetter => {
          const value = restCursors[cursorSetter]
          q[cursorSetter](value)
        })
      } catch (error) {
        /** "q[cursorSetter] is not a function" */
        if (error instanceof TypeError) {
          throw new RestEmixException() // This error should be never throw
        }
      }

      /**
       * Reminder: "gives you a fully-fledged promise"
       * Source: http://mongoosejs.com/docs/promises.html
       */
      const data = await q.exec()

      if (!data) throw new NotFoundError()

      /**
       * The user can't do that, he's unauthorized
       */
      if (cancan(user)('index')(data) === false) throw new CannotError()

      return data
    },

    async show(req, { user, query } = {}) {
      const restFilter = getRestFilters(req)('show');
      const resource = getResourceName(req);
      const cancan = CanCan(getPolicy(resource)); // Okay, on travaille avec cette politique qui est lié à la resource de la requête
      const model = getModel(resource);

      if (!query) query = { slug: req.params.slug };

      // db.collection.findOne(query, projection) restFilter = projection
      const q = model.findOne(query, restFilter);
      const data = await q.exec();

      if (!data) throw new NotFoundError();

      if (cancan(user)('show')(data) === false) throw new CannotError();

      return data;
    },

    async update (req, { user, query } = {}) {
      const resource = getResourceName(req);
      const model = getModel(resource);
      const schemaObject = getSchemaObject(resource);
      const cancan = CanCan(getPolicy(resource));

      const body = fillSchema(schemaObject)(req.body);
      if (!query) query = { slug: req.params.slug };

      const q = model.findOne(query);
      const data = await q.exec();

      if (!data) throw new NotFoundError();

      if (cancan(user)('update')(data) === false) throw new CannotError();

      _merge(data, body);
      return data.save();
    },

    async create (req, { user } = {}) {
      const resourceName = getResourceName(req);
      const model = getModel(resourceName);
      const schemaObject = getSchemaObject(resourceName);
      const cancan = CanCan(getPolicy(resourceName));

      const body = fillSchema(schemaObject)(req.body);

      if (cancan(user)('create')() === false) throw new CannotError(); // TODO: peut poser problème

      return model.create(body);
    },

    async delete (req, { user, query } = {}) {
      const resource = getResourceName(req);
      const model = getModel(resource);
      const cancan = CanCan(getPolicy(resource));

      if (!query) query = { slug: req.params.slug };

      const q = model.findOne(query);
      const data = await q.exec();

      if (!data) throw new NotFoundError();

      if (cancan(user)('delete')(data) === false) throw new CannotError();

      return data.remove();
    },
  }
};

module.exports = Controller;
