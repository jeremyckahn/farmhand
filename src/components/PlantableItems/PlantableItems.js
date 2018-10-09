import React from 'react';
import { array, func } from 'prop-types';
import Item from '../Item';
import './PlantableItems.css';

export const PlantableItems = ({ handleSelectPlantableItem, inventory }) => (
  <div className="PlantableItems">
    <ul>
      {inventory.map(item => (
        <li key={item.id} onClick={() => handleSelectPlantableItem(item)}>
          <Item {...{ item }} />
        </li>
      ))}
    </ul>
  </div>
);

PlantableItems.propTypes = {
  handleSelectPlantableItem: func.isRequired,
  inventory: array.isRequired,
};

export default PlantableItems;
