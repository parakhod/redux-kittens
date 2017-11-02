'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.promiseKitten = exports.storageKitten = exports.socketIoKitten = exports.superagentKitten = exports.timerKitten = exports.delayKitten = exports.reduxKittens = undefined;

var _delayKitten = require('./delayKitten');

var _delayKitten2 = _interopRequireDefault(_delayKitten);

var _timerKitten = require('./timerKitten');

var _timerKitten2 = _interopRequireDefault(_timerKitten);

var _superagentKitten = require('./superagentKitten');

var _superagentKitten2 = _interopRequireDefault(_superagentKitten);

var _socketIoKitten = require('./socketIoKitten');

var _socketIoKitten2 = _interopRequireDefault(_socketIoKitten);

var _promiseKitten = require('./promiseKitten');

var _promiseKitten2 = _interopRequireDefault(_promiseKitten);

var _storageKitten = require('./storageKitten');

var _storageKitten2 = _interopRequireDefault(_storageKitten);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reduxKittens = function reduxKittens(options) {
  return [(0, _delayKitten2.default)(options), (0, _timerKitten2.default)(options), (0, _superagentKitten2.default)(options), (0, _socketIoKitten2.default)(options), (0, _promiseKitten2.default)(options), (0, _storageKitten2.default)(options)];
};

exports.reduxKittens = reduxKittens;
exports.delayKitten = _delayKitten2.default;
exports.timerKitten = _timerKitten2.default;
exports.superagentKitten = _superagentKitten2.default;
exports.socketIoKitten = _socketIoKitten2.default;
exports.storageKitten = _storageKitten2.default;
exports.promiseKitten = _promiseKitten2.default;
exports.default = {
  reduxKittens: reduxKittens,

  delayKitten: _delayKitten2.default,
  timerKitten: _timerKitten2.default,
  superagentKitten: _superagentKitten2.default,
  socketIoKitten: _socketIoKitten2.default,
  storageKitten: _storageKitten2.default,
  promiseKitten: _promiseKitten2.default
};