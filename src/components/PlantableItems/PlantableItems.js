import React from 'react';
import FarmhandContext from '../../Farmhand.context';
import { array, func, string } from 'prop-types';
import Item from '../Item';
import './PlantableItems.sass';

export const PlantableItems = ({
  handleItemSelect,
  plantableCropInventory,
  selectedItemId,
}) => (
  <div className="PlantableItems">
    <ul>
      {plantableCropInventory.map(item => (
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
  handleItemSelect: func.isRequired,
  plantableCropInventory: array.isRequired,
  selectedItemId: string.isRequired,
};

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <PlantableItems {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  );
}
