# Redux KITtens  🐾

Redux middleware kit
Simple way to create http requests, create and manage websockets, timer, promises etc. - just pass the plain objects objects as a payload.
Also every KITten already have the built-in logger, so no need to add some other logging middleware.

## Installation

__npm install -s redux-kittens__

## Usage
- [Timer kitten](#timer-kitten) - timer middleware
- [Delay kitten](#delay-kitten) - delay middleware
- [Superagent kitten](#superagent-kitten) - http request middleware
- [Socket.io kitten](#socketio-kitten) - Socket.io client middleware
- [Storage kitten](#storage-kitten) - localStorage and AsyncStorage middleware
- [Promise kitten](#promise-kitten) - promise middleware


### Global settings

```
import {
  reduxKittens, /* all in one initialization */

  delayKitten, ... /* or add only kittens you need */
} from 'redux-kittens';

const options = {enableLog: true};

const store = applyMiddleware( ...reduxKittens(options) )(createStore)(reducer); // Apply all the middlewares
   OR
const store = applyMiddleware( /* one by one */
  delayKitten(options),
  timerKitten(options),
  superagentKitten(options),
  socketIoKitten(options),
  storageKitten(options),
  promiseKitten(options)
)(createStore)(reducer);

```

______
### 🐱 Timer kitten
`timerKitten(options)`

Payload should be a plain object with properties:
- `use: 'timer'`
- `method` - `'start'` or `'stop'`
- `id` - timer's ID, optional (you can have several timers with the different IDs)
- `interval` - interval in __ms__
#### Start timer
```
store.dispatch({ 
  type: 'TIMER_CALL', //or whatever you want
  payload: {
      use: 'timer',
      method: 'start',
      id: 'my_timer_number_one', 
      interval: 1000 //one second      
    }
  });
```
In the reducer you will get:
`{ meta: { sequence: 'start' }}`
and then
`{ meta: { sequence: 'tick', iteration: NN /* number of iteration */ }}`
on every timer's call.
If the timer with this name is already started this action call will be ignored.
#### Stop timer
```
...
  payload: {
      use: 'timer',
      method: 'stop',
      name: 'my_timer_number_one',
    }
```
In the reducer you will get:
`{ meta: { sequence: 'stop' }}`
#### Restart timer
```
...
  payload: {
      use: 'timer',
      method: 'restart',
      name: 'my_timer_number_one',
    }
```
#### [options]
- `enableLog` - set to `true` to enable console logging
______
### 🐱 Delay kitten
`delayKitten(options)`

Payload should be a plain object with properties:
- `use: 'delay'`
- `delay` - interval in __ms__

#### Reducer events:
- `{ meta: { sequence: 'begin' }}` - after right the delay creation
- `{ meta: { sequence: 'complete' }}` - at the end of the interval
#### [options]
`enableLog` - set to `true` to enable console logging
______
### 🐱 Superagent kitten
`superagentKitten(options)`

Middleware for the async requests via __http__ and __https__. It uses promisified [superagent](https://visionmedia.github.io/superagent/) library.

Payload should be a plain object with properties:
- `use: 'request'`
- `url` 
- `method` - `'GET'`, `'POST'` etc.
- `query` - request query, as an object
- `data` - request payload
- `accept`
- `boundary`
- `sendAsForm` - set to `true` if you want to send the `data` as a form
- `contentType`
- `files` - pass here the `FileList` object if you want to upload the files, the form will be created automatically,  content of the `data` will be added as a form fields
- `allowedFileTypes` - array, MIME file types for upload, or just `image` or `video` - all the other files will be ignored
- `reportProgress` - set it to `true` if you want to receive the events about the operation progress, for example during the uploading of the large files
#### Create request
```
store.dispatch({ 
  type: 'GET_REMOTE_URL', //or whatever you want
  payload: {
      use: 'request',
      method: 'GET',
      url: 'https://your.site/api'      
    }
  });
```
#### Reducer events
- `{ meta: { sequence: 'begin' }}` - request was made
- `{ meta: { sequence: 'complete' }, payload: { ...dataFromServer }}` - data recieved
- `{ meta: { sequence: 'error' }, payload: { ...ErrorData }}` - error during the request

#### [options]
- `enableLog` - set to `true` to enable console logging
- `getToken` - optional function, provide auth token here, `getToken: () => yourCustomToken`

#### Authentication
Middleware __automatically__ gets the value of the store `session.token` (supported both plain JS object and  __Immutable__ reducers), it will be send in the `'Authorization'` header field.
If you want to manually specify the `'Authorization'` header value, use the `getToken` parameter in the options
______
### 🐱 Socket.io kitten
`socketIoKitten(options)`

Middleware for socket.io. It uses [socket.io-client](https://github.com/socketio/socket.io-client) library.

Payload should be a plain object with properties:
- `use: 'socketIo'`
- `url` 
- `method` - `connect` or `disconnect`
- `name` - socket name
- `query` - query params for connection
- `listeners: []` - array of listeners, `'connect'`, `'disconnect'`, custom event names
#### Connect to server
```
store.dispatch({ 
  type: 'TIMER_CALL', //or whatever you want
  payload: {
    use: 'socketIo',
    method: 'connect',
    name: 'someSocket',
    url: 'https://your.site/socket_io',
    query: { id: 2 },
    listeners: ['connect', 'disconnect', YOUR_EVENT_NAME, ...]
  }
});
```
#### Reducer events
- `{ meta: { sequence: 'sequence: 'connectRequest' }}` - rigth after the 'connect' action call
- `{ meta: { sequence: 'connect' }}` - connected to server
- `{ meta: { sequence: 'disconnect' }}` - disconnected to server
- `{ meta: { sequence: YOUR_EVENT_NAME }}` - when socket receives `YOUR_EVENT_NAME` from the server. `YOUR_EVENT_NAME` __should be__ in the `listeners` list

#### [options]
- `enableLog` - set to `true` to enable console logging
- `getToken` - optional function, provide auth token here, `getToken: () => yourCustomToken`
- `socketOptions` - look the [socket.io-client documentation](https://github.com/socketio/socket.io-client/blob/master/docs/API.md#new-managerurl-options)

#### Authentication
Middleware __automatically__ gets the value of the store `session.token` (supported both plain JS object and  __Immutable__ reducers), it will be send in the `'Authorization'` header field.
If you want to manually specify the `'Authorization'` header value, use the `getToken` parameter in the options
______
### 🐱 Storage kitten
`storageKitten(options)`

Middleware for local storage in browser apps and AsyncStorage in ReactNative

Payload should be a plain object with properties:
- `use: 'storage'`
- `method` - `get`, `set` or `remove`
- `data` - key name, or object with keys and values

#### Reducer events
- `{ meta: { sequence: 'begin' }}` - rigth after the action call
- `{ meta: { sequence: 'complete' }, payload: { ...yourData }}` - data fetched
- `{ meta: { sequence: 'error' }}` - some error occurred

#### [options]
- `enableLog` - set to `true` to enable console logging
______
### 🐱 Promise kitten
`promiseKitten(options)`

Just pass the Promise as a payload, and it will be handled with this middleware

#### Reducer events
- `{ meta: { sequence: 'begin' }}` - rigth after the action call
- `{ meta: { sequence: 'complete' }}` - if the promise resolved
- `{ meta: { sequence: 'error' }}` - if the promise was rejected

#### [options]
- `enableLog` - set to `true` to enable console logging
