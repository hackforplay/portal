import React from 'react';
import ReactDOM from 'react-dom';
import Products from './Products';

const props = {
  handleLoad: jest.fn(),
  products: [
    {
      content_url: 'https://hack-rpg.hackforplay.xyz/hack-rpg.json',
      id: 'M2aE1L4uV20tSwQGe6CH',
      thumbnail:
        'https://assets.feeles.com/thumbnail/d4c8780f57b4288a6887f491c3f13aa0.jpg',
      title: 'チュートリアル'
    }
  ]
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Products {...props} />, div);
});
