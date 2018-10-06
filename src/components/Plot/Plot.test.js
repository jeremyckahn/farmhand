import React from 'react';
import ReactDOM from 'react-dom';
import Plot from './Plot';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Plot />, div);
});
