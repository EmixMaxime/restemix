const chai   = require('chai');
const sinon  = require('sinon');
const expect = chai.expect;

const getResourceName = require('../http/Controllers/utils/getResourceName.js');

const controllerServiceProvider = require('../http/Controllers/ControllerServiceProvider').controllerServiceProvider;

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
  const fakeActionFunction = (action) => {};
  const fakeRequestFunction = (req) => fakeActionFunction;

  sinon.spy(fakeActionFunction);
  sinon.spy(fakeRequestFunction);
};

describe('Controller', () => {

  describe.skip('#index, #show called getRestFilters', () => {
    it('It should call getRestFilters function with the request and call the returns function with action index', () => {
      const callback = () => {};
      const getResourceName = getResourceNameMock();
      // const controller = Controller({ getRestFilters, getRestCursor, getResourceName, null, null, getModel, getSchemaObject });
      controller.show(req, callback);
    });
  });

  describe('It should call the model with the cursor setters (limit, sort)', () => {
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

    const getPolicy = () => {};
    const updateDatabase = () => {};
    const fillSchema = () => {};
    const Cancan = () => {};
    const getSchemaObject = () => {};
    const getResourceName = () => {};

    const fakeModel = {
      find: () => fakeModel,
      findOne: () => fakeModel,
      limit: (num) => {},
      sort: (num) => {},
      exec: (cb) => {},
    };

    const limitSpy = sinon.spy(fakeModel, 'limit');
    const sortSpy = sinon.spy(fakeModel, 'sort');
    const execSpy = sinon.spy(fakeModel, 'exec');

    const getModel = () => {
      return fakeModel
    };

    const executeTest = function (method) {
      const Controller = controllerServiceProvider({
        getRestFilters, getRestCursor, getResourceName, updateDatabase, fillSchema,
        Cancan
      });

      const controller = Controller(getModel, getSchemaObject, getPolicy);

      controller[method](fakeRequest, () => {});

      expect(sortSpy.withArgs(sortValue).calledOnce).to.be.true;
      expect(limitSpy.withArgs(limitValue).calledOnce).to.be.true;
      expect(execSpy.calledOnce).to.be.true;

      sortSpy.restore();
      limitSpy.restore();
      execSpy.restore();
    };

    it('Index method', () => {
      executeTest('index');
    });

    it('Show method', () => {
      executeTest('show');
    });

  })
});
