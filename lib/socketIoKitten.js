import io from 'socket.io-client';

const sockets = {};

const socketIoKitten = ({ 
    enableLog = false,
    getToken,
    socketOptions = {}
  } = {}) => ({ 
    getState 
  }) => 
  next => 
  action => {
    if (action.payload && action.payload.use === 'socketIo') {
      const {
        payload,
        meta = {}
      } = action;

      const {
        method,
        name = 'default_socket',
        url,
        listeners,
        target,
        data
      } = payload;

      switch (method) {
        case 'connect':
          if (sockets[name]) {
            if (enableLog) {
              console.log(`%cClosing old socket ${name}`, 'color: orange; font-weight: bold');
            }
            sockets[name].close();
            sockets[name] = null;
          }

          const state = getState();

          const token = 
            typeof getToken === 'function' ? getToken() :
            state.session && state.session.token ? state.session.token :
            state.getIn && state.getIn(['session', 'token']);

          const connectionOptions = token ? 
            {
              transportOptions: {
                polling: {
                  extraHeaders: {
                    'Authorization': token
                  }
                }
              }
            } : {};


          sockets[name] = io(url, {
            ...connectionOptions,
            ...socketOptions
          });

          listeners.map(listener => {
            sockets[name].on(listener, payload => {
              if (enableLog && !meta.disableLog) {
                console.log(
                  `%c${name} ⇐ ${listener}`,
                  'color: green; font-weight: bold',
                  payload || meta.payload || getState().getIn(['session', 'username']) || '');
              }
              next({
                ...action,
                payload,
                meta: {
                  ...meta,
                  sequence: listener
                }})}
              )});

          next({
            ...action,
            meta: {
              ...meta,
              sequence: 'connectRequest' 
            }});
          break;

      case 'emit':
        if (sockets[name]) {
          sockets[name].emit(target, data);
          if (enableLog) {
            console.log(
              `%c${name} ⇒ emit ${target}`,
              'color: navy; font-weight: bold',
              payload || meta.payload);
          }
          next({
            ...action,
            payload: data,
            meta: {
              ...meta,
              sequence: `emit_${target}`
            }})
        } else {
          if (enableLog) {
            console.log(`%cSocket ${name} doesn't exist, cannot emit ${target}`, 'color: red; font-weight: bold');
          }
        }
        break;

      case 'disconnect':
        sockets[name].removeAllListeners();
        sockets[name].disconnect(true);
        enableLog && console.log(
          `%c${name} disconnect`,
          'color: orange; font-weight: bold');
 
        next({
          ...action,
          payload: data,
          meta: {
            ...meta,
            sequence: 'disconnect'
          }
        })     
      }
    }

    else {
      next(action);
    }
  }

export default socketIoKitten;

