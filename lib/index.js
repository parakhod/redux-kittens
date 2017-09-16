import delayKitten from './delayKitten';
import timerKitten from './timerKitten';
import superagentKitten from './superagentKitten';
import socketIoKitten from './socketIoKitten';
import promiseKitten from './promiseKitten';

import storageKitten from './browserStorageKitten';

const reduxKittens = options => [
  delayKitten(options),
  timerKitten(options), 
  superagentKitten(options),
  socketIoKitten(options),
  promiseKitten(options),
  storageKitten(options)
]

export {
  reduxKittens,

  delayKitten,
  timerKitten,
  superagentKitten,
  socketIoKitten,
  storageKitten,
  promiseKitten
}

export default {
  reduxKittens,

  delayKitten,
  timerKitten,
  superagentKitten,
  socketIoKitten,
  storageKitten,
  promiseKitten
}
