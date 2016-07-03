import 'isomorphic-fetch';
import promise from 'es6-promise';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import createStore from './createStore';
import Main from 'containers/Main';

promise.polyfill();

const store = createStore();

render(
  (<Provider store={store}>
    <Main />
  </Provider>)
, document.getElementById('flow-app-container'));

document.body.style.visibility = 'visible';
