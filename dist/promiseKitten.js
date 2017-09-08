'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var promiseKitten = function promiseKitten() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$enableLog = _ref.enableLog,
      enableLog = _ref$enableLog === undefined ? false : _ref$enableLog;

  return function () {
    return function (next) {
      return function (action) {
        if (action.payload && typeof action.payload.then === 'function') {
          var payload = action.payload,
              _action$meta = action.meta,
              meta = _action$meta === undefined ? {} : _action$meta;


          var name = meta.name || 'Promise';

          var handleError = function handleError(error) {
            if (enableLog && !meta.disableLog) {
              var errorText = 'Error ' + error.code + ' / ' + error.message;

              console.log('%c\u21E9 ' + name + ' ' + errorText, 'color: red; font-weight: bold');
            }

            return next(_extends({}, action, {
              payload: error,
              meta: _extends({}, action.meta, {
                sequence: 'error'
              }) }));
          };

          payload.then(function (result) {
            if (enableLog && !meta.disableLog) {
              console.log('%c\u21E9 ' + name, 'color: navy; font-weight: bold', result);
            }
            return next(_extends({}, action, {
              payload: result,
              meta: _extends({}, meta, {
                sequence: 'complete'
              }) }));
          }).catch(function (error) {
            return handleError(error);
          });

          next(_extends({}, action, {
            meta: _extends({}, meta, {
              sequence: 'begin'
            }) }));

          if (enableLog && !meta.disableLog) {
            console.log('%c\u21EA ' + name, 'color: green; font-weight: bold', meta.payload || action.payload);
          }
        } else {
          next(action);
        }
      };
    };
  };
};

exports.default = promiseKitten;