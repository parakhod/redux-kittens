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
              _payload$id = payload.id,
              id = _payload$id === undefined ? 'default_timer' : _payload$id,
              _payload$interval = payload.interval,
              interval = _payload$interval === undefined ? 1000 : _payload$interval;


          counters[id] = 0;

          if (method === 'start' && !timers[id] || method === 'restart' && timers[id]) {
            if (timers[id]) {
              clearInterval(timers[id]);
            }

            timers[id] = setInterval(function () {
              enableLog && !meta.disableLog && console.log('%c\u23F0 ' + type, 'color: navy; font-weight: bold', 'Timer tick ' + counters[id]);

              return next(_extends({}, action, {
                meta: _extends({}, action.meta, {
                  iteration: counters[id]++,
                  sequence: 'tick'
                }) }));
            }, interval);

            enableLog && !meta.disableLog && console.log('%c\u23F0 ' + type, 'color: green; font-weight: bold', 'Timer start');

            return next(_extends({}, action, {
              meta: _extends({}, action.meta, {
                sequence: 'start'
              }) }));
          } else if (method === 'stop') {
            clearInterval(timers[id]);

            timers[id] = null;

            enableLog && !meta.disableLog && console.log('%c\u23F0 ' + type, 'color: orange; font-weight: bold', 'Timer stop');

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