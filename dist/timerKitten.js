'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var timers = {};
var counters = {};

var timerKitten = function timerKitten() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$enableLog = _ref.enableLog,
      enableLog = _ref$enableLog === undefined ? false : _ref$enableLog;

  return function () {
    return function (next) {
      return function (action) {

        if (action.payload && action.payload.use === 'timer') {
          var payload = action.payload,
              type = action.type,
              _action$meta = action.meta,
              meta = _action$meta === undefined ? {} : _action$meta;
          var method = payload.method,
              _payload$name = payload.name,
              name = _payload$name === undefined ? 'default_timer' : _payload$name,
              _payload$interval = payload.interval,
              interval = _payload$interval === undefined ? 1000 : _payload$interval;


          counters[name] = 0;

          if (method === 'start') {

            timers[name] = setInterval(function () {
              enableLog && !meta.disableLog && console.log('%c\u21EA ' + type, 'color: navy; font-weight: bold', 'Timer tick ' + counters[name]);

              return next(_extends({}, action, {
                meta: _extends({}, action.meta, {
                  iteration: counters[name]++,
                  sequence: 'start'
                }) }));
            }, interval);

            enableLog && !meta.disableLog && console.log('%c\u21EA ' + type, 'color: green; font-weight: bold', 'Timer start');

            return next(_extends({}, action, {
              meta: _extends({}, action.meta, {
                sequence: 'start'
              }) }));
          } else if (method === 'stop') {
            clearInterval(timers[name]);

            enableLog && !meta.disableLog && console.log('%c\u21EA ' + type, 'color: orange; font-weight: bold', 'Timer stop');

            return next(_extends({}, action, {
              meta: _extends({}, action.meta, {
                sequence: 'stop'
              }) }));
          }
        } else {
          next(action);
        }
      };
    };
  };
};

exports.default = timerKitten;