'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.promiseKitten = exports.socketIoKitten = exports.superagentKitten = exports.timerKitten = exports.delayKitten = undefined;

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.delayKitten = _delayKitten2.default;
exports.timerKitten = _timerKitten2.default;
exports.superagentKitten = _superagentKitten2.default;
exports.socketIoKitten = _socketIoKitten2.default;
exports.promiseKitten = _promiseKitten2.default;
exports.default = {
  delayKitten: _delayKitten2.default,
  timerKitten: _timerKitten2.default,
  superagentKitten: _superagentKitten2.default,
  socketIoKitten: _socketIoKitten2.default,
  promiseKitten: _promiseKitten2.default
};