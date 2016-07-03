let optionalMiddleware = [];

if (process.env.NODE_ENV !== 'production') {
  const createLogger = require('redux-logger');
  const Immutable = require('immutable');

  optionalMiddleware = [createLogger({
    collapsed: true,
    duration: true,
    stateTransformer(state) {
      const newState = {};
      Object.keys(state).forEach(function(i) {
        if (Immutable.Iterable.isIterable(state[i])) {
          newState[i] = state[i].toJS();
        } else {
          newState[i] = state[i];
        }
      });
      return newState;
    }
  })];
}

export default [
  ...optionalMiddleware
];
