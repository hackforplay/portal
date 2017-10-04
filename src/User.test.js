import React from 'react';
import ReactDOM from 'react-dom';
import Uesr from './Uesr';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Uesr />, div);
});
