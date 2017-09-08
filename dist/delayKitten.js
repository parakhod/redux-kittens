'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var delayKitten = function delayKitten() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$enableLog = _ref.enableLog,
      enableLog = _ref$enableLog === undefined ? false : _ref$enableLog;

  return function () {
    return function (next) {
      return function (action) {
        if (action.payload && action.payload.use === 'delay') {
          var payload = action.payload,
              type = action.type,
              _action$meta = action.meta,
              meta = _action$meta === undefined ? {} : _action$meta;


          setTimeout(function () {
            enableLog && !meta.disableLog && console.log('%c\u21EA ' + type, 'color: navy; font-weight: bold', 'Delay end');

            return next(_extends({}, action, {
              meta: _extends({}, meta, {
                sequence: 'complete'
              }) }));
          }, payload.delay || 1000);

          enableLog && !meta.disableLog && console.log('%c\u21EA ' + type, 'color: green; font-weight: bold', 'Delay start');

          return next(_extends({}, action, {
            meta: _extends({}, meta, {
              sequence: 'begin'
            }) }));
        } else {
          next(action);
        }
      };
    };
  };
};

exports.default = delayKitten;