const delayKitten = ({ 
    enableLog = false
  } = {}) => 
  () => 
  next => 
  action => {
    if (action.payload && action.payload.use === 'delay') {

      const { 
        payload, 
        type,
        meta = {} 
      } = action;

      setTimeout(() => {
        enableLog && !meta.disableLog && console.log(
          `%c⇪ ${type}`,
          'color: navy; font-weight: bold',
          'Delay end');

        return next({ 
          ...action, 
          meta: {
            ...meta,
            sequence: 'complete' 
        }})
      }, payload.delay || 1000);

      enableLog && !meta.disableLog && console.log(
        `%c⇪ ${type}`,
        'color: green; font-weight: bold',
        'Delay start');      

      return next({ 
        ...action, 
        meta: {
          ...meta, 
          sequence: 'begin' 
      }})
    }
    else {
      next(action);
    }
}

export default delayKitten;
