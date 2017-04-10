const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const sinon = require('sinon');
const expect = chai.expect;

chai.use(chaiAsPromised);

const Cannot = require('../http/Controllers/Exceptions/CannotError');

const getResourceName = require('../http/Controllers/utils/getResourceName.js');

const controllerServiceProvider = require('../http/Controllers/ControllerServiceProvider').controllerServiceProvider;

const controller = require('../index');

describe('index.js', () => {
  it('It should export my controller', () => {
    expect(typeof controller).to.equal('function');
  });
});

// import Controller from '../http/Controllers/Controller';

const getResourceNameMock = function (fakeRequest, resourceName = 'categories') {
  const getResourceNameMock = sinon.expectation.create(getResourceName);
  getResourceNameMock
    .once()
    .withArgs(fakeRequest)
    .returns(resourceName); // Return the parameter resourceName
  return getResourceNameMock;
};

const getRestFiltersMock = function (fakeRequest, fakeAction) {
  const fakeActionFunction = (action) => { };
  const fakeRequestFunction = (req) => fakeActionFunction;

  sinon.spy(fakeActionFunction);
  sinon.spy(fakeRequestFunction);
};

describe('Controller', () => {

  describe.skip('#index, #show called getRestFilters', () => {
    it('It should call getRestFilters function with the request and call the returns function with action index', () => {
      const callback = () => { };
      const getResourceName = getResourceNameMock();
      // const controller = Controller({ getRestFilters, getRestCursor, getResourceName, null, null, getModel, getSchemaObject });
      controller.show(req, callback);
    });
  });

  describe.skip('All methods call properly cancan', () => {
    const getRestFilters = () => () => { return {} };
    const getRestCursor = getRestFilters;

    const getResourceName = () => { };

    const fakePolicy = {};
    const getPolicy = function (resourceName) {
      return fakePolicy;
    };

    const cancanData = (data) => true;
    const cancanAction = (action) => { console.log({ action }); return cancanData };
    const cancanUser = (user) => {  console.log('user ', user); return cancanAction };
    const CanCan = function (policy) {
      console.log({policy});
      return cancanUser;
    };

    const cancanSpy = sinon.spy(CanCan);
    const cancanDataSpy = sinon.spy(cancanData);
    const cancanActionSpy = sinon.spy(cancanAction);
    const cancanUserSpy = sinon.spy(cancanUser);

    const fakeData = {
      title: 'Who is emix?'
    };

    const fakeModel = {
      find: () => fakeModel,
      exec: () => new Promise(resolve => resolve(fakeModel)),
    };

    const getModel = () => fakeModel;

    const fakeRequest = {
      jwt: 'emix',
    };

    const fillSchema = () => { };

    const Controller = controllerServiceProvider({
      getResourceName, getRestCursor, getRestFilters, fillSchema,
      CanCan
    });

    it('lol', () => {
      const controller = Controller(getModel, () => { }, getPolicy);

      return controller.index(fakeRequest).then(() => {
        console.log('call count : ', cancanSpy.callCount);// POURQUOI 0....
        expect(cancanActionSpy.calledWith('index')).to.be.false;

        expect(cancanDataSpy.withArgs(fakeData).called).to.be.false;
      });
    });

  });

  describe('Check calls cursor and setter mongodb function', () => {
    const projection = { title: true };
    let actionFunction = (action) => projection;
    const getRestFilters = (req) => actionFunction;

    const limitValue = 5;
    const sortValue = { price: -1, rate: 1 };
    const cursorSetter = {
      limit: limitValue,
      sort: sortValue
    };

    const fakeRequest = {
      query: {
        limit: 5,
        sort: 'price,rate',
        asc: 'rate',
        desc: 'price'
      },
      params: {}
    };

    actionFunction = (action) => cursorSetter;
    const getRestCursor = (req) => actionFunction;

    const getPolicy = () => { };
    const updateDatabase = () => { };
    const fillSchema = () => { };
    const CanCan = () => () => () => () => true;
    const getSchemaObject = () => { };
    const getResourceName = () => { };

    const fakeData = { };

    const fakeModel = {
      find: () => fakeModel,
      findOne: () => fakeModel,
      limit: (num) => { },
      sort: (num) => { },
      exec: (cb) => fakeData,
    };

    const getModel = () => {
      return fakeModel
    };

    const limitSpy = sinon.spy(fakeModel, 'limit');
    const sortSpy = sinon.spy(fakeModel, 'sort');
    const execSpy = sinon.spy(fakeModel, 'exec');


    it('It should call the model with the cursor setters (limit, sort)', () => {
      const Controller = controllerServiceProvider({
        getRestFilters, getRestCursor, getResourceName, updateDatabase, fillSchema,
        CanCan
      });

      const controller = Controller(getModel, getSchemaObject, getPolicy);
      const indexResult = controller.index(fakeRequest);
      return indexResult.then(() => {
        expect(sortSpy.withArgs(sortValue).calledOnce, 'Sort function on model are not called properly (with goods arguments)').to.be.true;
        expect(limitSpy.withArgs(limitValue).calledOnce, 'Limit function on model are not called properly (with goods arguments)').to.be.true;
        expect(execSpy.calledOnce, 'Exec function on model are not called').to.be.true;

        sortSpy.restore();
        limitSpy.restore();
        execSpy.restore();
      });
    });

  });

  describe('#index, #show, #update, Test the returns values', () => {
    const fakeData = {
      title: 'Hello world',
      description: 'Are you okay?',
    };

    const fakeModel = {
      find: () => fakeModel,
      findOne: () => fakeModel,
      limit: (num) => { },
      sort: (num) => { },
      save: () => fakeData,
      exec: () => {
        return new Promise((resolve, reject) => {
          return resolve({ fakeData, save: fakeModel.save });
        });
      },
    };

    const fakeRequest = {
      jwt: '',
      params: {
        series: 'CSS is awesome',
      },
    };

    const getModel = () => fakeModel;
    const getSchemaObject = () => { };
    const getPolicy = () => { };

    const fakeControllerToTestReturnValue = function ({ getRestFilters, getRestCursor, getResourceName, fillSchema, CanCan } = {}) {
      /** Controller fake dependencies */
      getRestFilters = getRestFilters || function () { return () => true };
      getRestCursor = getRestCursor || function () { return () => true };
      getResourceName = getResourceName || function () { return () => 'series' };
      fillSchema = fillSchema || function () { return () => true };
      CanCan = CanCan || function () {
        return () => () => () => true;
      };

      const _merge = () => {};

      return controllerServiceProvider({
        getRestFilters, getRestCursor, getResourceName, fillSchema,
        CanCan, _merge
      });
    };


    it('It should returns a promise, resolvable with the data object', () => {
      const Controller = fakeControllerToTestReturnValue();

      const controller = Controller(getModel, getSchemaObject, getPolicy);

      const resultIndex = controller.index(fakeRequest);
      const resultShow = controller.show(fakeRequest);

      /** To perform an update : I use findOne()/exec and on the result .exec, so I need to modify the comportement of exec method */
      const resultUpdate = controller.update(fakeRequest);

      return Promise.all([resultIndex, resultShow, resultUpdate]).then(([resultIndex, resultShow, resultUpdate]) => {
        expect(resultIndex.fakeData).to.deep.equal(fakeData);
        expect(resultShow.fakeData).to.deep.equal(fakeData);
        /** Because I work on save function, which returns fakeData only, not a object with fakeData as key */
        expect(resultUpdate).to.deep.equal(fakeData);
      });

    });

    it('It should throw a Cannot', () => {
      const CanCan = function () {
        return () => () => () => false; // Simulate, the user cannot do everything
      };

      const Controller = fakeControllerToTestReturnValue({ CanCan });
      const controller = Controller(getModel, getSchemaObject, getPolicy);

      const resultIndex = controller.index(fakeRequest);
      const resultShow = controller.show(fakeRequest);
      const resultUpdate = controller.update(fakeRequest);
      return Promise.all([
        expect(resultIndex).to.be.rejectedWith(Cannot),
        expect(resultShow).to.be.rejectedWith(Cannot),
        expect(resultUpdate).to.be.rejectedWith(Cannot),
      ]);
      // return expect(resultPromise).to.be.rejectedWith(Cannot);
    });


  });

  describe.skip('#update', () => {


    it('It should call findOne with the correct mongo query', () => {

      const requestParamSlug = 'json-web-token';
      const resourceName = 'tutorials';

      const fakeRequest = {
        body: {
          title: 'What is json web token?',
          online: true
        },
        params: {}
      };
      fakeRequest.params[resourceName] = requestParamSlug;

      // Into my database (simulation)
      const fakeData = {
        title: 'Discovering the json web token !',
        slug: 'json-web-token',
        description: "It's very powerfull",
        author: 'emix',
        online: false
      };

      const fillSchema = function (schemObject) {
        return (body) => fakeRequest.body
      };

      const Cancan = function (policy) {
        return (user) => (action) => (data) => { };
      };

      const fakeModel = {
        findOne: (query, callback) => callback(null, fakeData),
        save: (callback) => { }
      };

      const getModel = () => fakeModel;
      const getSchemaObject = () => { };
      const getPolicy = () => { };
      const getResourceName = (req) => resourceName;

      const getResourceNameSpy = sinon.spy(getResourceName);


      const findOneSpy = sinon.spy(fakeModel, 'findOne');
      const saveSpy = sinon.spy(fakeModel, 'save');

      const Controller = controllerServiceProvider({
        getResourceName, fillSchema,
        Cancan
      });

      const controller = Controller(getModel, getSchemaObject, getPolicy);


      const callback = (err, data) => { };
      controller.update(fakeRequest, callback);

      // console.log({fakeRequest});
      expect(getResourceNameSpy.withArgs(fakeRequest).called).to.be.true;

      // expect(findOneSpy.withArgs({ slug: requestParamSlug}, callback).calledOnce).to.be.true;


    });
  });
});
