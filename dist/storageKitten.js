'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _catBox = require('cat-box');

var storageKitten = function storageKitten() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$enableLog = _ref.enableLog,
      enableLog = _ref$enableLog === undefined ? false : _ref$enableLog;

  return function () {
    return function (next) {
      return function (action) {
        if (action.payload && action.payload.use === 'storage') {
          var payload = action.payload,
              type = action.type,
              _action$meta = action.meta,
              meta = _action$meta === undefined ? {} : _action$meta;
          var data = payload.data,
              _payload$method = payload.method,
              method = _payload$method === undefined ? 'get' : _payload$method;


          var methodName = method.toLowerCase();

          var nextBegin = function nextBegin(v) {
            enableLog && !meta.disableLog && console.log('%c\uD83D\uDCE6 ' + type + ' (' + method + ')', 'color: green; font-weight: bold', v);

            return next(_extends({}, action, {
              payload: v,
              meta: _extends({}, meta, {
                sequence: 'begin'
              }) }));
          };

          var nextComplete = function nextComplete(v) {
            enableLog && !meta.disableLog && console.log('%c\uD83D\uDCE6 ' + type + ' (' + method + ')', 'color: navy; font-weight: bold', methodName === 'get' ? v : '');

            return next(_extends({}, action, {
              payload: v,
              meta: _extends({}, meta, {
                sequence: 'complete'
              }) }));
          };

          var storeAction = methodName === 'set' ? _catBox.storageSet : methodName === 'get' ? _catBox.storageGet : methodName === 'remove' ? _catBox.storageRemove : null;

          if (typeof storeAction === 'function') {
            var processData = storeAction(data);
            if (processData && processData.then) {
              nextBegin(data);
              processData.then(function (v) {
                return nextComplete(v);
              });
            } else {
              nextComplete(processData);
            }
          }
        } else {
          next(action);
        }
      };
    };
  };
};

exports.default = storageKitten;