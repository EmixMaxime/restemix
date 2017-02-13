const chai   = require('chai');
const sinon  = require('sinon');
const expect = chai.expect;

// import Controller from '../http/Controllers/Controller';

const getResourceNameMock = function (resourceName = 'categories') {
  const getResourceName = () => {};
  const getResourceNameMock = sinon.expectation.create(getResourceName);
  getResourceNameMock
    .once()
    .withArgs(resourceName)
    .returns(resourceName); // Return the parameter resourceName
  return getResourceNameMock;
}

describe.skip('Controller', () => {
  describe('#index, #show called getRestFilters', () => {
    it('It should call getRestFilters function with the request and call the returns function with action index', () => {
      const callback = () => {};
      const getResourceName = getResourceNameMock();
      // const controller = Controller({ getRestFilters, getRestCursor, getResourceName, null, null, getModel, getSchemaObject });
      controller.show(req, callback);
    });
  });
});
