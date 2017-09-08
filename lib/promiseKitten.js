const promiseKitten = ({ 
    enableLog = false
  } = {}) => 
  () => 
  next => 
  action => {
    if (action.payload && typeof action.payload.then === 'function') {
      const { 
        payload, 
        meta = {} 
      } = action;

      const name = meta.name || 'Promise';

      const handleError = error => {
        if (enableLog && !meta.disableLog) {
          const errorText = `Error ${error.code} / ${error.message}`;

          console.log(
            `%c⇩ ${name} ${errorText}`,
            'color: red; font-weight: bold' );          
        }        

        return next({ 
          ...action, 
          payload: error, 
          meta: {
            ...action.meta, 
            sequence: 'error' 
        }})
      }

      payload.then(
        result => {
            if (enableLog && !meta.disableLog) {
              console.log(
                `%c⇩ ${name}`,
                'color: navy; font-weight: bold',
                result );
            }
          return next({ 
            ...action,
            payload: result,
            meta: {
              ...meta,
              sequence: 'complete' 
            } })
          }
        )
        .catch(error => handleError(error));

      next({
        ...action,
        meta: {
          ...meta,
          sequence: 'begin' 
        }});

      if (enableLog && !meta.disableLog) {
        console.log(
          `%c⇪ ${name}`,
          'color: green; font-weight: bold',
          meta.payload || action.payload);
      }
    }
    else {
      next(action);
    }
  }

export default promiseKitten
