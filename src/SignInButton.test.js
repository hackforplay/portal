import React from 'react';
import ReactDOM from 'react-dom';
import SignInButton from './SignInButton';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SignInButton />, div);
});
