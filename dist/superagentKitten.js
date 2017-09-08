'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _superagentPromise = require('superagent-promise');

var _superagentPromise2 = _interopRequireDefault(_superagentPromise);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = (0, _superagentPromise2.default)(_superagent2.default, _bluebird2.default);

var superagentKitten = function superagentKitten() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$enableLog = _ref.enableLog,
      enableLog = _ref$enableLog === undefined ? false : _ref$enableLog,
      getToken = _ref.getToken;

  return function (_ref2) {
    var getState = _ref2.getState;
    return function (next) {
      return function (action) {
        if (action.payload && action.payload.use === 'request') {
          var payload = action.payload,
              type = action.type,
              _action$meta = action.meta,
              meta = _action$meta === undefined ? {} : _action$meta;
          var url = payload.url,
              method = payload.method,
              data = payload.data,
              query = payload.query,
              accept = payload.accept,
              boundary = payload.boundary,
              formFields = payload.formFields,
              contentType = payload.contentType,
              reportProgress = payload.reportProgress;


          var state = getState();

          var token = typeof getToken === 'function' ? getToken() : state.session && state.session.token ? state.session.token : state.getIn && state.getIn(['session', 'token']);

          var handleError = function handleError(err) {
            if (enableLog && !meta.disableLog) {
              var errorText = err ? err.status ? 'Error ' + err.status + ' / ' + (err.response.body || {}).message : err : 'Unknown error';
              console.log('%c\u21E9 ' + action.type + ' ' + errorText, 'color: red; font-weight: bold');
            }

            return next(_extends({}, action, {
              payload: err,
              meta: _extends({}, action.meta, {
                sequence: 'error'
              }) }));
          };

          var handleProgress = function handleProgress(progress) {
            if (enableLog && meta.enableProgressLog && !meta.disableLog) {
              console.info('%c\u21E9 ' + action.type, 'color: orange; font-weight: bold', parseInt(progress.percent) + '% \r');
            }

            return next(_extends({}, action, {
              request: request,
              payload: {
                progress: progress.percent ? progress.percent / 100 : 1.0
              },
              meta: _extends({}, action.meta, {
                sequence: 'progress'
              })
            }));
          };

          var requestObject = request(method, url);

          if (token) {
            requestObject.set('Authorization', token);
          }

          if (accept) {
            requestObject.set('Accept', accept);
          }

          if (contentType) {
            requestObject.set('Content-Type', contentType);
          }

          if (reportProgress) {
            requestObject.on('progress', function (progress) {
              return handleProgress(progress);
            });
          }

          if (data) {
            requestObject.send(data);
          }

          if (query) {
            requestObject.query(query);
          }

          if (formFields) {
            Object.keys(formFields).forEach(function (field) {
              requestObject.attach(field, formFields[field]);
            });
          }

          requestObject.then(function (response) {
            var error = response.error;

            if (error) {
              return handleError(error);
            } else {
              enableLog && !meta.disableLog && console.log('%c\u21E9 ' + type, 'color: navy; font-weight: bold', response.body || JSON.stringify(response));

              return next(_extends({}, action, {
                payload: response.body,
                meta: _extends({}, meta, {
                  sequence: 'complete'
                })
              }));
            }
          }).catch(function (error) {
            return handleError(error);
          });

          next(_extends({}, action, {
            meta: _extends({}, meta, {
              sequence: 'begin'
            }) }));

          if (enableLog && !meta.disableLog) {
            var messageText = method ? method + ' ' + url : payload;
            console.log('%c\u21EA ' + type, 'color: green; font-weight: bold', messageText, data || (formFields ? Object.keys(formFields) : ''));
          }
        } else {
          next(action);
        }
      };
    };
  };
};

exports.default = superagentKitten;