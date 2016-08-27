'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLogger = exports.createStore = undefined;

var _createStore = require('./createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _createLogger = require('./createLogger');

var _createLogger2 = _interopRequireDefault(_createLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * relite
 */
var createStore = exports.createStore = _createStore2.default;
var createLogger = exports.createLogger = _createLogger2.default;