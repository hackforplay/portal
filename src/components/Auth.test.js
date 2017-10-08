import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Auth from './Auth';

const props = {
  handleLoad: jest.fn(),
  handleSignOut: jest.fn(),
  isSignedOut: false
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Router>
      <Auth {...props} />
    </Router>,
    div
  );
});
