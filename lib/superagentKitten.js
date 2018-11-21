import request from 'superagent';
import createUploadForm from './utils/createUploadForm';

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
        sendAsForm = false,
        files,
        allowedFileTypes,
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

      let additionalMeta = {};

      const requestObject = request(method, url);

      if (token) {
        requestObject.set('Authorization', token);
      }

      if (accept) {
        requestObject.set('Accept', accept);
      }

      if (reportProgress) {
        requestObject.on('progress', progress => handleProgress(progress))
      }

      if (files) {
        const f = createUploadForm(files, data, 
          Array.isArray(allowedFileTypes) ? allowedFileTypes :
          typeof allowedFileTypes === 'string' ? [allowedFileTypes] : null);

        Object.keys(f.formData).forEach(field => {            
          requestObject.attach(field, f.formData[field]);
        });

        additionalMeta = { files: f.files };

      } else if (data && typeof data === 'object') {
        if (sendAsForm) {
          const fdata = new FormData();
          Object.keys(data).forEach(field =>
            fdata.append(field, data[field]));
          requestObject.send(fdata);
        } else {
          requestObject.send(data);
        }
      }

      if (query) {
        requestObject.query(query);
      }

      if (contentType) {
        requestObject.set('Content-Type', contentType);
      }
        
      requestObject.end((error, response) => {
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

      next({
        ...action,
        meta: {
          ...meta,
          ...additionalMeta,
          sequence: 'begin'
        }});

      if (enableLog && !meta.disableLog) {
        const messageText = method ? 
          `${method} ${url}` : payload;
        console.log(
          `%c⇪ ${type}`,
          'color: green; font-weight: bold',
          messageText,
          sendAsForm && typeof data === 'object' ? Object.keys(data) : data || query || '') ;
      }
    } else {
      next(action);
    }
  }

export default superagentKitten;
