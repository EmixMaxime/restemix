const getRestFilters = require('../RestFiltersServiceProvider').getRestFilters;
const getRestCursor = require('../RestCursorsServiceProvider').getRestCursor;
const fillSchema = require('fill-schema');
const Controller = require('./Controller');
const getResourceName = require('./utils/getResourceName');

const CanCan = require('cancancan');

const _merge = require('lodash/merge');

const controllerServiceProvider = (dependencies) => Controller.bind(null, dependencies);
const controller = controllerServiceProvider({ getRestFilters, getRestCursor, getResourceName, fillSchema, CanCan, _merge });

module.exports = {
  controllerServiceProvider,
  controller,
};
