import React from 'react';
import FarmhandContext from '../../Farmhand.context';
import { array, func, shape, string } from 'prop-types';
import Item from '../Item';
import './PlantableItems.sass';

export const PlantableItems = ({
  handlers: { handleItemSelect },
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

export default function Consumer() {
  return (
    <FarmhandContext.Consumer>
      {context => <PlantableItems {...context} />}
    </FarmhandContext.Consumer>
  );
}
