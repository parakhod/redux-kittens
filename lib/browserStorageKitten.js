const storageKitten = ({ 
    enableLog = false
  } = {}) => 
  () => 
  next => 
  action => {
    if (action.payload && action.payload.use === 'storage') {

      const { 
        payload,
        type,
        meta = {} 
      } = action;

      const {
        data,
        method = 'get'
      } = payload;

      const methodName = method.toLowerCase() + 'Item';     

      const keys = 
        typeof data === 'string' ? [data] :
        
        Array.isArray(data) && (methodName === 'getItem' || methodName === 'removeItem') ? data :
        typeof data === 'object' ? Object.keys(data) : [];


      if (keys.length > 0 && (methodName === 'getItem' || methodName === 'setItem' || methodName === 'removeItem')) {

        const replyPayload = keys.reduce((p,v) => ({
            ...p,
            [v]: localStorage[methodName === 'setItem' && !data[v] ? 'removeItem' : methodName]( v, 
                typeof data === 'object' ? data[v] : null
              ) || (methodName === 'removeItem' ? null : data[v])
          }), {});
         
        enableLog && !meta.disableLog && console.log(
          `%c📦 ${type} (${method})`,
          'color: navy; font-weight: bold',
          replyPayload);

        return next({ 
          ...action,
          payload: replyPayload,
          meta: {
            ...meta, 
            sequence: 'complete' 
        }})
      }

      const error = keys.length === 0 ? 'No keys to proceed' : 'Unknown method';

      enableLog && !meta.disableLog && console.log(
        `%c📦 ${type} (${method})`,
        'color: red; font-weight: bold',
        error);

      return next({ 
        ...action, 
        meta: {
          ...meta, 
          error,
          sequence: 'error' 
      }})
    }
    else {
      next(action);
    }
}

export default storageKitten;
