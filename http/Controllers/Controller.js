const CannotException = require('./Exceptions/CannotException');
const RestEmixException = require('./Exceptions/RestEmixException');

// getModel et getSchemaObject sont injectés dans RestController de l'application ;-)
const Controller = ({ getRestFilters, getRestCursor, getResourceName, fillSchema, CanCan, _merge }, getModel, getSchemaObject, getPolicy) => {

  // Validate the dependencies needs to be function
  const functionDeps = { getRestFilters, getRestCursor, getResourceName, fillSchema, CanCan, getModel, getSchemaObject, getPolicy };
  Object.keys(functionDeps).forEach(dep => {
    if (typeof functionDeps[dep] !== 'function') throw new Error(`${dep} must be a function ! But it's a ${typeof dep}`);
  });

  return {
    async index (req) {
      const restFilter = getRestFilters(req)('index');
      const restCursor = getRestCursor(req)('index'); // { limit: 5, sort: { price: -1 } }
      const cursorSetters = Object.keys(restCursor); // [limit, sort]

      // const restCursor = { lol: true, troll: false };
      // const cursorSetters = [];

      const resource = getResourceName(req);
      const cancan = CanCan(getPolicy(resource)); // Okay, on travaille avec cette politique qui est lié à la resource de la requête
      const model = getModel(resource);

      const userReq = req.jwt;

      // Prepare the query with the cursor setters (limit, sort)
      // The first {} it will be the where clause (?where:price>5)
      // It will come in the future version (not now!)

      /** Just in case */
      const q = model.find({}, restFilter);
      try {
        cursorSetters.forEach(cursorSetter => {
          const value = restCursor[cursorSetter];
          q[cursorSetter](value);
        });
      } catch (error) {
        /** "q[cursorSetter] is not a function" */
        if (error instanceof TypeError) {
          throw new RestEmixException(); // This error should be never throw
        }
      }

      const data = await q.exec();

      if (cancan(userReq)('index')(data) === false) {
        // The user can't do that, he's unauthorized
        throw new CannotException();
      }

      return data;
    },
    async show(req) {
      const restFilter = getRestFilters(req)('show');
      const resource = getResourceName(req);
      const cancan = CanCan(getPolicy(resource)); // Okay, on travaille avec cette politique qui est lié à la resource de la requête
      const model = getModel(resource);
      const user = req.jwt;

      const query = { slug: req.params[resource] };

      // db.collection.findOne(query, projection) restFilter = projection
      const q = model.findOne(query, restFilter);
      const data = await q.exec();

      if (cancan(user)('show')(data) === false) throw new CannotException();

      return data;
    },

    async update(req, callback) {
      const resource = getResourceName(req);
      const model = getModel(resource);
      const schemaObject = getSchemaObject(resource);
      const cancan = CanCan(getPolicy(resource));
      const user = req.jwt;

      const body = fillSchema(schemaObject)(req.body);
      const query = { slug: req.params[resource] };

      const q = model.findOne(query);
      const data = await q.exec();

      if (cancan(user)('update')(data) === false) throw new CannotException();

      _merge(data, body);
      return data.save();
    },

    async create(req, callback) {
      const resourceName = getResourceName(req);
      const model = getModel(resourceName);
      const schemaObject = getSchemaObject(resourceName);
      const cancan = CanCan(getPolicy(resourceName));
      const user = req.jwt;

      const body = fillSchema(schemaObject)(req.body);

      if (cancan(user)('create')() === false) throw new CannotException(); // TODO: peut poser problème

      const data = await model.create(body);
      return data;
    },

    async delete(req, callback) {
      const resource = getResourceName(req);
      const model = getModel(resource);
      const cancan = CanCan(getPolicy(resource));
      const user = req.jwt;

      const query = { slug: req.params[resource] };

      const q = model.findOne(query);
      const data = await q.exec();

      if (cancan(user)('delete')(data) === false) throw new CannotException();

      return data.remove();
    }
  }
};

module.exports = Controller;