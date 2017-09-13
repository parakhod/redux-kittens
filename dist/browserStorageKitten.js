'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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


          var methodName = method.toLowerCase() + 'Item';

          var keys = typeof data === 'string' ? [data] : Array.isArray(data) && (methodName === 'getItem' || methodName === 'removeItem') ? data : (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' ? Object.keys(data) : [];

          if (keys.length > 0 && (methodName === 'getItem' || methodName === 'setItem' || methodName === 'removeItem')) {

            var replyPayload = keys.reduce(function (p, v) {
              return _extends({}, p, _defineProperty({}, v, localStorage[methodName === 'setItem' && !data[v] ? 'removeItem' : methodName](v, (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' ? data[v] : null) || (methodName === 'removeItem' ? null : data[v])));
            }, {});

            enableLog && !meta.disableLog && console.log('%c\uD83D\uDCE6 ' + type + ' (' + method + ')', 'color: navy; font-weight: bold', replyPayload);

            return next(_extends({}, action, {
              payload: replyPayload,
              meta: _extends({}, meta, {
                sequence: 'complete'
              }) }));
          }

          var error = keys.length === 0 ? 'No keys to proceed' : 'Unknown method';

          enableLog && !meta.disableLog && console.log('%c\uD83D\uDCE6 ' + type + ' (' + method + ')', 'color: red; font-weight: bold', error);

          return next(_extends({}, action, {
            meta: _extends({}, meta, {
              error: error,
              sequence: 'error'
            }) }));
        } else {
          next(action);
        }
      };
    };
  };
};

exports.default = storageKitten;