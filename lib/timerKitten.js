const timers = {};
const counters = {};

const timerKitten = ({ 
    enableLog = false
  } = {}) => 
  () => 
  next => 
  action => {

    if (action.payload && action.payload.use === 'timer') {

      const {
        payload,
        type,
        meta = {}
      } = action;

       const {
         method,
         name = 'default_timer',
         interval = 1000
       } = payload;

      counters[name] = 0;

      if (method === 'start') {

        timers[name] = setInterval(() => {
          enableLog && !meta.disableLog && console.log(
            `%c⇪ ${type}`,
            'color: navy; font-weight: bold',
            `Timer tick ${counters[name]}`);

          return next({ 
            ...action, 
            meta: {
              ...action.meta,
              iteration: counters[name]++,
              sequence: 'start' 
          }})
        }, interval);

        enableLog && !meta.disableLog && console.log(
          `%c⇪ ${type}`,
          'color: green; font-weight: bold',
          'Timer start');

      return next({ 
        ...action, 
        meta: {
          ...action.meta, 
          sequence: 'start' 
      }}) 

      } else if (method === 'stop') {
        clearInterval(timers[name]);

        enableLog && !meta.disableLog && console.log(
          `%c⇪ ${type}`,
          'color: orange; font-weight: bold',
          'Timer stop');

        return next({ 
          ...action, 
          meta: {
            ...action.meta, 
            sequence: 'stop' 
        }})
      }
    }

    else {
      next(action);
    }
  }

export default timerKitten
