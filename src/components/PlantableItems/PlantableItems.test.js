import React from 'react';
import ReactDOM from 'react-dom';
import PlantableItems from './PlantableItems';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PlantableItems />, div);
});
