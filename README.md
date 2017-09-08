# Redux KITtens

With this Redux middleware kit, you can make http requests, create and manage websockets, timer, promises etc. with your Redux just creating the actions with simple objects as a payload. 
Also every KITten already have the built-in logger, so no need to add some other logging middleware.

## Installation

__npm install -s redux-kittens__

## Usage
- [Timer kitten](#timer-kitten) - timer middleware
- [Delay kitten](#delay-kitten) - delay middleware
- [Superagent kitten](#superagent-kitten) - http request middleware
- [Socket.io kitten](#socketio-kitten) - Socket.io client middleware
- [Promise kitten](#promise-kitten) - promise middleware


### Global settings

```
import {
  delayKitten,
  timerKitten,
  superagentKitten,
  socketIoKitten,
  promiseKitten
} from 'redux-kittens';

const options = {enableLog: true};
const createStoreWithMiddleware = applyMiddleware(
  thunk,
  delayKitten(options),
  timerKitten(options),
  superagentKitten(options),
  socketIoKitten(options),
  promiseKitten(options)
)(createStore);

const store = createStoreWithMiddleware(reducer);
```


### Timer kitten
______
`timerKitten(options)`

Payload should be a plain object with properties:
- `use: 'timer'`
- `method` - `'start'` or `'stop'`
- `name` - timer's name, optional (you can have several timers with the different names)
- `interval` - interval in __ms__
#### Start timer
```
store.dispatch({ 
  type: 'TIMER_CALL', //or whatever you want
  payload: {
      use: 'timer',
      method: 'start',
      name: 'my_timer_number_one',
      interval: 1000 //one second      
    }
  });
```
In the reducer you will get:
`{ meta: { sequence: 'start' }}`
and then
`{ meta: { sequence: 'timer', iteration: NN /* number of iteration */ }}`
on every timer's call
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
#### [options]
`enableLog` - set to `true` to enable console logging

### Delay kitten
______
`delayKitten(options)`

Payload should be a plain object with properties:
- `use: 'delay'`
- `delay` - interval in __ms__

#### Reducer events:
`{ meta: { sequence: 'begin' }}` - after right the delay creation
`{ meta: { sequence: 'complete' }}` - at the end of the interval
#### [options]
`enableLog` - set to `true` to enable console logging

### Superagent kitten
______
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
- `formFields` - if you want to send the form, just pass the object with the form fields here
- `contentType`
- `reportProgress` - set it to `true` if you want to receive the events about the operation progress, for example during the uploading of the large file
#### Create request
```
store.dispatch({ 
  type: 'TIMER_CALL', //or whatever you want
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
`enableLog` - set to `true` to enable console logging
`getToken` - optional function, provide auth token here, `getToken: () => yourCustomToken`

#### Authentication
Middleware __automatically__ gets the value of the store `session.token` (supported both plain JS object and  __Immutable__ reducers), it will be send in the `'Authorization'` header field.
If you want to manually specify the `'Authorization'` header value, use the `getToken` parameter in the options

### Socket.io kitten
______
`socketIoKitten(options)`

Middleware for socket.io. It uses [socket.io-client](https://github.com/socketio/socket.io-client) library.

Payload should be a plain object with properties:
- `use: 'socketIo'`
- `url` 
- `method` - `connect` or `disconnect`
- `name` - socket name
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
`enableLog` - set to `true` to enable console logging
`getToken` - optional function, provide auth token here, `getToken: () => yourCustomToken`
`socketOptions` - look the [socket.io-client documentation](https://github.com/socketio/socket.io-client/blob/master/docs/API.md#new-managerurl-options)

#### Authentication
Middleware __automatically__ gets the value of the store `session.token` (supported both plain JS object and  __Immutable__ reducers), it will be send in the `'Authorization'` header field.
If you want to manually specify the `'Authorization'` header value, use the `getToken` parameter in the options

### Promise kitten
______
`promiseKitten(options)`

Just pass the Promise as a payload, and it will be handled with this middleware

#### Reducer events
- `{ meta: { sequence: 'begin' }}` - rigth after the action call
- `{ meta: { sequence: 'complete' }}` - if the promise resolved
- `{ meta: { sequence: 'error' }}` - if the promise was rejected

#### [options]
`enableLog` - set to `true` to enable console logging
