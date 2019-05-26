import React from 'react';
import { array, string } from 'prop-types';

import FarmhandContext from '../../Farmhand.context';
import Item from '../Item';
import './PlantableItems.sass';

export const PlantableItems = ({ plantableCropInventory, selectedItemId }) => (
  <div className="PlantableItems">
    <ul>
      {plantableCropInventory.map(item => (
        <li key={item.id}>
          <Item
            {...{
              item,
              isSelected: item.id === selectedItemId,
              isSelectView: true,
            }}
          />
        </li>
      ))}
    </ul>
  </div>
);

PlantableItems.propTypes = {
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
