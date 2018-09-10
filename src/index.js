// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reduxReset from 'redux-reset';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import moment from 'moment';
import 'moment/locale/ja';
import 'normalize.css';
import '@babel/polyfill';
import 'url-search-params-polyfill';
import objectFitImages from 'object-fit-images';

import './index.css';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';
import reducer from './ducks';
import './settings/firebase';
import MaterialUIJssProvider from './MaterialUIJssProvider';

objectFitImages();

moment.locale(navigator.language);

const middleware = [thunk];
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
}

const enhancer = composeWithDevTools(
  applyMiddleware(...middleware),
  reduxReset()
);

const store = createStore(reducer, enhancer);

const app = document.getElementById('app');

if (!app) {
  throw new Error('#app container is not found');
}

ReactDOM.render(
  <Provider store={store}>
    <MaterialUIJssProvider>
      <App />
    </MaterialUIJssProvider>
  </Provider>,
  app
);
registerServiceWorker();

if (process.env.NODE_ENV === 'production') {
  // https://github.com/rollbar/rollbar.js
  import('./Rollbar');
}
