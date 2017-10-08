import React from 'react';
import ReactDOM from 'react-dom';
import User from './User';

const props = {
  handleLoad: jest.fn()
};

const user = {
  custom_id: 'teramotodaiki',
  display_name: 'てら',
  icon_url:
    'https://scontent-nrt1-1.xx.fbcdn.net/v/t31.0-8/1962080_787788621298446_530818820652434087_o.jpg?oh=8b0d19646b0d14004cbf7261e760c7a7&oe=5A7BE6CD',
  id: 'RFE9SsEk61t47eISdqJH',
  uid: 'nbZ2qvzzb2Pwk9rDbtaxWncSqXt1'
};

describe('renders without crashing', () => {
  it('completed fetching', () => {
    const div = document.createElement('div');
    ReactDOM.render(<User {...props} isFetching={false} user={user} />, div);
  });

  it('waiting for fetching', () => {
    const div = document.createElement('div');
    ReactDOM.render(<User {...props} isFetching={true} user={null} />, div);
  });
});
