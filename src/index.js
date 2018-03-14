import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reduxReset from 'redux-reset';
import moment from 'moment';
import 'moment/locale/ja';
import 'normalize.css';
import '@babel/polyfill';
import 'url-search-params-polyfill';

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

const enhancer = compose(applyMiddleware(...middleware), reduxReset());

const store = createStore(reducer, enhancer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
// registerServiceWorker();

if (process.env.NODE_ENV === 'production') {
  // https://github.com/rollbar/rollbar.js
  import('./Rollbar');
}
