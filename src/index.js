import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import moment from 'moment';
import 'moment/locale/ja';
import 'normalize.css';
import '@babel/polyfill';

import './index.css';
import App from './containers/App';
// import registerServiceWorker from './registerServiceWorker';
import reducer from './ducks';
import './settings/firebase';

moment.locale(navigator.language);

const middleware = [thunk];
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
}

const store = createStore(reducer, applyMiddleware(...middleware));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
// registerServiceWorker();

if (process.env.NODE_ENV === 'production') {
  // https://github.com/googleanalytics/autotrack
  import('autotrack/autotrack');

  // https://github.com/rollbar/rollbar.js
  import('./Rollbar');
}
