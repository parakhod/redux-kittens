import {
  storageGet,
  storageSet,
  storageRemove
} from 'cat-box';

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

      const methodName = method.toLowerCase();

      const nextBegin = v => {        
        enableLog && !meta.disableLog && console.log(
          `%c📦 ${type} (${method})`,
          'color: green; font-weight: bold',
          v);

        return next({ 
          ...action,
          payload: v,
          meta: {
            ...meta, 
            sequence: 'begin' 
        }})
      }

      const nextComplete = v => { 
        enableLog && !meta.disableLog && console.log(
          `%c📦 ${type} (${method})`,
          'color: navy; font-weight: bold',
          methodName === 'get' ? v : '');

        return next({ 
          ...action,
          payload: v,
          meta: {
            ...meta, 
            sequence: 'complete' 
        }})
      }

      const storeAction = 
        methodName === 'set' ? storageSet :
        methodName === 'get' ? storageGet :
        methodName === 'remove' ? storageRemove :
        null;

      if (typeof storeAction === 'function') {
        const processData = storeAction(data);
        if (processData) {
          nextBegin(data);
          processData.then(v => nextComplete(v));
        } 
      }       
    }
    else {
      next(action);
    }
}

export default storageKitten;
