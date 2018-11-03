import React from 'react';
import { array, func, shape, string } from 'prop-types';
import Item from '../Item';
import './PlantableItems.sass';

export const PlantableItems = ({
  handlers: { handleSelectPlantableItem },
  state,
  state: { plantableInventory, selectedPlantableItemId },
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
  state: shape({
    plantableInventory: array.isRequired,
    selectedPlantableItemId: string.isRequired,
  }).isRequired,
};

export default PlantableItems;
