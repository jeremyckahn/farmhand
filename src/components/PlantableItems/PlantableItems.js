import React from 'react';
import { array, func, string } from 'prop-types';
import Item from '../Item';
import './PlantableItems.css';

export const PlantableItems = ({
  handleSelectPlantableItem,
  inventory,
  selectedPlantableItemId,
}) => (
  <div className="PlantableItems">
    <ul>
      {inventory.map(item => (
        <li key={item.id} onClick={() => handleSelectPlantableItem(item)}>
          <Item
            {...{ item, isSelected: item.id === selectedPlantableItemId }}
          />
        </li>
      ))}
    </ul>
  </div>
);

PlantableItems.propTypes = {
  handleSelectPlantableItem: func.isRequired,
  inventory: array.isRequired,
  selectedPlantableItemId: string.isRequired,
};

export default PlantableItems;
