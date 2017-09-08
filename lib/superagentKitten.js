import Promise from 'bluebird';
import SuperagentPromise from 'superagent-promise';
import Superagent from 'superagent';

const request = SuperagentPromise(Superagent, Promise);

const superagentKitten = ({ 
    enableLog = false,
    getToken
  } = {}) => ({ 
    getState 
  }) => 
  next => 
  action => {
    if (action.payload && action.payload.use === 'request') {
      const { 
        payload, 
        type,
        meta = {} 
      } = action;

      const {
        url,
        method,
        data,
        query,
        accept,
        boundary,
        formFields,
        contentType,
        reportProgress
      } = payload;

      const state = getState();

      const token = 
        typeof getToken === 'function' ? getToken() :
        state.session && state.session.token ? state.session.token :
        state.getIn && state.getIn(['session', 'token']);

      const handleError = err => {
        if (enableLog && !meta.disableLog) {
          const errorText = err ? err.status ? `Error ${err.status} / ${(err.response.body || {}).message}` :
            err : 'Unknown error';
          console.log(
            `%c⇩ ${action.type} ${errorText}`,
            'color: red; font-weight: bold' );          
        }

        return next({
          ...action,
          payload: err, 
          meta: {
            ...action.meta, 
            sequence: 'error' 
        }}) 

      }

      const handleProgress = progress => {
        if (enableLog && meta.enableProgressLog && !meta.disableLog) {       
          console.info(
            `%c⇩ ${action.type}`,
            'color: orange; font-weight: bold', 
            `${parseInt(progress.percent)}% \r`);
          }    
       
        return next({ 
          ...action,
          request,
          payload: {
            progress: progress.percent ? progress.percent / 100 : 1.0
          },
          meta: {
            ...action.meta, 
            sequence: 'progress' 
          }
        })
      }

      const requestObject = request(method, url);

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
        requestObject.on('progress', progress => handleProgress(progress))
      }

      if (data) {
        requestObject.send(data);
      }

      if (query) {
        requestObject.query(query);
      }

      if (formFields) {
        Object.keys(formFields).forEach(field => {
          requestObject.attach(field, formFields[field])
        })
      }
        
      requestObject.then(response => {
          const { error } = response;
          if (error) { 
            return handleError(error);
          } else {
            enableLog && !meta.disableLog && console.log(
              `%c⇩ ${type}`,
              'color: navy; font-weight: bold',
              response.body || JSON.stringify(response) );
            
            return next({ 
              ...action,
              payload: response.body,
              meta: {
                ...meta,
                sequence: 'complete' 
              } 
            })
          }
        })
        .catch(error => handleError(error));

      next({
        ...action,
        meta: {
          ...meta,
          sequence: 'begin' 
        }});

      if (enableLog && !meta.disableLog) {
        const messageText = method ? 
          `${method} ${url}` : payload;
        console.log(
          `%c⇪ ${type}`,
          'color: green; font-weight: bold',
          messageText,
          data || (formFields ? Object.keys(formFields) : ''));
      }
    }

    else {
      next(action);
    }
  }

export default superagentKitten;
