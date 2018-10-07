import React from 'react';
import { array } from 'prop-types';
import Item from '../Item';
import './PlantableItems.css';

export const PlantableItems = ({ inventory }) => (
  <div className="PlantableItems">
    <ul>
      {inventory.map(item => (
        <li key={item.id}>
          <Item {...{ item }} />
        </li>
      ))}
    </ul>
  </div>
);

PlantableItems.propTypes = {
  inventory: array.isRequired,
};

export default PlantableItems;
