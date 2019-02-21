import React from 'react';
import { array, func, shape, string } from 'prop-types';
import Item from '../Item';
import './PlantableItems.sass';

export const PlantableItems = ({
  handlers: { handleItemSelect },
  state,
  state: { plantableInventory, selectedItemId },
}) => (
  <div className="PlantableItems">
    <ul>
      {plantableInventory.map(item => (
        <li key={item.id} onClick={() => handleItemSelect(item)}>
          <Item
            {...{
              item,
              isSelected: item.id === selectedItemId,
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
    handleItemSelect: func.isRequired,
  }).isRequired,
  state: shape({
    plantableInventory: array.isRequired,
    selectedItemId: string.isRequired,
  }).isRequired,
};

export default PlantableItems;
