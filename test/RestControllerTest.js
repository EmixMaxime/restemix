// import { RestController, getModel, getResourceName, updateDatabase, getSchemaObject } from '../../../app/http/Controllers/RestController'
//
// import { controllerServiceProvider } from '../http/Controllers/ControllerServiceProvider';
// import { getRestFiltersFactory } from '../http/RestFilters';

const chai   = require('chai');
const sinon  = require('sinon');
const expect = chai.expect;

describe.skip('RestController', () => {

  // filter = globalement le slug
  // et filters provient de mon système de restAPI ex : ?fields=title le filters est donc = { title: true }
  // Rappel : pas besoin que tout le reste soit à false, mongo sélectionne bien que le true ;)

  // fakeData = false -> le model ne retourne rien (comme si la bdd était vide)
  const getModelMock = (fakeData, filter, filters) => {
    fakeData = fakeData === false ? null : { title: 'javascript', description: "I'am troll" }
    // The data returns to the database

    const fakeModel =  {
      findOne (filter, filters, callback) {
        return callback(null, fakeData)
      }
    }

    const modelMock = sinon.expectation.create(getModel)
    modelMock
      .once()
      .withArgs('categories')
      .returns(fakeModel)

    return { modelMock, fakeData }
  }

  const dependencies = (resourceName = 'categories') => {
    const fakeRequest = { params: resourceName, baseUrl: resourceName, rest: {} };

    const fakeResponse = {
      statusCode: null,
      jsonData: null,
      status (code) { this.statusCode = code; return this },
      sendStatus (code) { this.status(code) },
      json (data) { this.jsonData = data }
    };

    const getResourceNameMock = sinon.expectation.create(getResourceName);
    getResourceNameMock
      .once()
      .withArgs(resourceName)
      .returns(resourceName); // Return the parameter resourceName

    return {
      getResourceNameMock,
      fakeRequest, fakeResponse
    }
  }

  describe('#show', () => {

    // http://stackoverflow.com/questions/11552991/cleaning-up-sinon-stubs-easily
    // let sandbox;
    // beforeEach(() => {
    //   sandbox = sinon.sandbox.create()
    // })
    //
    // afterEach(() => {
    //   sandbox.restore()
    // })

    it('It should return response with json data and 200 statusCode', () => {
      const { getResourceNameMock, fakeRequest, fakeResponse } = dependencies();
      const { modelMock, fakeData } = getModelMock();

      const getRestFilters = getRestFiltersFactory();

      const restController = RestController(getResourceNameMock, modelMock);
      const Controller = controllerServiceProvider({getRestFilters, getRestCursor, getResourceName, updateDatabase, FillSchema});
      const controller = Controller();

      controller.show(fakeRequest, fakeResponse);

      expect(fakeResponse.jsonData).to.eql(fakeData);
      expect(fakeResponse.statusCode).to.equal(200);
    })

    it('It should return error 404', () => {
      const { getResourceNameMock, fakeRequest, fakeResponse } = dependencies();
      const { modelMock } = getModelMock(false);

      const restController = RestController(getResourceNameMock, modelMock);
      restController.show(fakeRequest, fakeResponse);

      expect(fakeResponse.jsonData).to.be.null;
      expect(fakeResponse.statusCode).to.equal(404);
    })

  })

  describe('#update', () => {

    const getUpdateDbMock = (modelMock) => {
      const updateDbMock = sinon.expectation.create(updateDatabase)
      updateDbMock
        .once()
        .withArgs(modelMock)
        .returns({})
      return updateDbMock
    }

    const getGetSchemaObjectMock = (resourceName, schema) => {
      const fakeSchema = schema || {
        title: String, description: String
      }

      const getSchemaObjectMock = sinon.expectation.create(getSchemaObject)
      getSchemaObjectMock
        .once()
        .withArgs(resourceName)
        .returns(fakeSchema)

      return { fakeSchema, getSchemaObjectMock }
    }

    const getMongoCheckerMock = () => {
      const mongoCheckerMock = sinon.mock(MongoChecker)


    }

    it('It should be okay', () => {
      const resourceName = 'categories'
      const fakeRequest = {
        params: [resourceName],
        originalUrl: resourceName,
        // originalUrl: '/categories/yolo-ca-va?excludes=slug',

        body: {
          title: 'lol'
        }
      }

      const { getResourceNameMock, fakeResponse } = dependencies();
      const { modelMock } = getModelMock();

      const updateDb = getUpdateDbMock(modelMock);
      const { getSchemaObjectMock, fakeSchema } = getGetSchemaObjectMock(resourceName);

      const restController = RestController(getResourceNameMock, modelMock, updateDb, getMongoCheckerMock, getSchemaObjectMock, FillSchema);
      restController.update(fakeRequest, fakeResponse);

    })

  })
})
