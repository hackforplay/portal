import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './App';
import reducer from '../reducers';

const store = createStore(reducer);

const props = {
  handleLoad: jest.fn()
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <App {...props} />
    </Provider>,
    div
  );
});
