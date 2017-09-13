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
         id = 'default_timer',
         interval = 1000
       } = payload;

      counters[id] = 0;

      if ((method === 'start' && !timers[id]) || (method === 'restart' && timers[id]) ) {
        if (timers[id]) {
          clearInterval(timers[id]);
        }

        timers[id] = setInterval(() => {
          enableLog && !meta.disableLog && console.log(
            `%c⏰ ${type}`,
            'color: navy; font-weight: bold',
            `Timer tick ${counters[id]}`);

          return next({ 
            ...action, 
            meta: {
              ...action.meta,
              iteration: counters[id]++,
              sequence: 'tick' 
          }})
        }, interval);

        enableLog && !meta.disableLog && console.log(
          `%c⏰ ${type}`,
          'color: green; font-weight: bold',
          'Timer start');

      return next({ 
        ...action, 
        meta: {
          ...action.meta, 
          sequence: 'start' 
      }}) 

      } else if (method === 'stop') {
        clearInterval(timers[id]);

        timers[id] = null;

        enableLog && !meta.disableLog && console.log(
          `%c⏰ ${type}`,
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
