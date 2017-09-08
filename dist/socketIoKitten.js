'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sockets = {};

var socketIoKitten = function socketIoKitten() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$enableLog = _ref.enableLog,
      enableLog = _ref$enableLog === undefined ? false : _ref$enableLog,
      getToken = _ref.getToken,
      _ref$socketOptions = _ref.socketOptions,
      socketOptions = _ref$socketOptions === undefined ? {} : _ref$socketOptions;

  return function (_ref2) {
    var getState = _ref2.getState;
    return function (next) {
      return function (action) {
        if (action.payload && action.payload.use === 'socketIo') {
          var payload = action.payload,
              _action$meta = action.meta,
              meta = _action$meta === undefined ? {} : _action$meta;
          var method = payload.method,
              _payload$name = payload.name,
              name = _payload$name === undefined ? 'default_socket' : _payload$name,
              url = payload.url,
              listeners = payload.listeners,
              target = payload.target,
              data = payload.data;


          switch (method) {
            case 'connect':
              if (sockets[name]) {
                if (enableLog) {
                  console.log('%cClosing old socket ' + name, 'color: orange; font-weight: bold');
                }
                sockets[name].close();
                sockets[name] = null;
              }

              var state = getState();

              var token = typeof getToken === 'function' ? getToken() : state.session && state.session.token ? state.session.token : state.getIn && state.getIn(['session', 'token']);

              var connectionOptions = token ? {
                transportOptions: {
                  polling: {
                    extraHeaders: {
                      'Authorization': token
                    }
                  }
                }
              } : {};

              sockets[name] = (0, _socket2.default)(url, _extends({}, connectionOptions, socketOptions));

              listeners.map(function (listener) {
                sockets[name].on(listener, function (payload) {
                  if (enableLog && !meta.disableLog) {
                    console.log('%c' + name + ' \u21D0 ' + listener, 'color: green; font-weight: bold', payload || meta.payload || getState().getIn(['session', 'username']) || '');
                  }
                  next(_extends({}, action, {
                    payload: payload,
                    meta: _extends({}, meta, {
                      sequence: listener
                    }) }));
                });
              });

              next(_extends({}, action, {
                meta: _extends({}, meta, {
                  sequence: 'connectRequest'
                }) }));
              break;

            case 'emit':
              if (sockets[name]) {
                sockets[name].emit(target, data);
                if (enableLog) {
                  console.log('%c' + name + ' \u21D2 emit ' + target, 'color: navy; font-weight: bold', payload || meta.payload);
                }
                next(_extends({}, action, {
                  payload: data,
                  meta: _extends({}, meta, {
                    sequence: 'emit_' + target
                  }) }));
              } else {
                if (enableLog) {
                  console.log('%cSocket ' + name + ' doesn\'t exist, cannot emit ' + target, 'color: red; font-weight: bold');
                }
              }
              break;

            case 'disconnect':
              sockets[name].removeAllListeners();
              sockets[name].disconnect(true);
              enableLog && console.log('%c' + name + ' disconnect', 'color: orange; font-weight: bold');

              next(_extends({}, action, {
                payload: data,
                meta: _extends({}, meta, {
                  sequence: 'disconnect'
                })
              }));
          }
        } else {
          next(action);
        }
      };
    };
  };
};

exports.default = socketIoKitten;