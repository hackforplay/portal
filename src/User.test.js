import React from 'react';
import ReactDOM from 'react-dom';
import User from './User';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const match = { params: { user: 'UID' } };
  ReactDOM.render(<User match={match} />, div);
});
