import React from 'react';
import { array, func, object, shape, string } from 'prop-types';
import Item from '../Item';
import './PlantableItems.css';

export const PlantableItems = ({
  handlers: { handleSelectPlantableItem },
  plantableInventory,
  selectedPlantableItemId,
  state,
}) => (
  <div className="PlantableItems">
    <ul>
      {plantableInventory.map(item => (
        <li key={item.id} onClick={() => handleSelectPlantableItem(item)}>
          <Item
            {...{
              item,
              isSelected: item.id === selectedPlantableItemId,
              state,
            }}
          />
        </li>
      ))}
    </ul>
  </div>
);

PlantableItems.propTypes = {
  handlers: shape({
    handleSelectPlantableItem: func.isRequired,
  }).isRequired,
  plantableInventory: array.isRequired,
  selectedPlantableItemId: string.isRequired,
  state: object.isRequired,
};

export default PlantableItems;
