import React from 'react';
import FarmhandContext from '../../Farmhand.context';
import { array, func, string } from 'prop-types';
import Item from '../Item';
import './FieldTools.sass';

export const FieldTools = ({
  fieldToolInventory,
  handleItemSelect,
  selectedItemId,
}) => (
  <div className="FieldTools">
    <ul>
      {fieldToolInventory.map(item => (
        <li key={item.id} onClick={() => handleItemSelect(item)}>
          <Item
            {...{
              item,
              isSelected: selectedItemId === item.id,
              isSelectView: true,
            }}
          />
        </li>
      ))}
    </ul>
  </div>
);

FieldTools.propTypes = {
  fieldToolInventory: array.isRequired,
  handleItemSelect: func.isRequired,
  selectedItemId: string.isRequired,
};

export default function Consumer() {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <FieldTools {...{ ...gameState, ...handlers }} />
      )}
    </FarmhandContext.Consumer>
  );
}
