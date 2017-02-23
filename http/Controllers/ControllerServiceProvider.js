const getRestFilters = require('../RestFilters').getRestFilters;
const getRestCursor = require('../RestCursor').getRestCursor;
const fillSchema = require('fill-schema');
const Controller = require('./Controller');
const getResourceName = require('./utils/getResourceName');

const CanCan = require('cancancan');

const controllerServiceProvider = (dependencies) => Controller.bind(null, dependencies);
const controller = controllerServiceProvider({ getRestFilters, getRestCursor, getResourceName, fillSchema, CanCan });

module.exports = {
  controllerServiceProvider,
  controller
};
