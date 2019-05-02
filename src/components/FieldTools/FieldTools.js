import React from 'react';
import FarmhandContext from '../../Farmhand.context';
import { array, func, shape, string } from 'prop-types';
import Item from '../Item';
import './FieldTools.sass';

export const FieldTools = ({
  handlers: { handleItemSelect },
  state: { fieldToolInventory, selectedItemId },
}) => (
  <div className="FieldTools">
    <ul>
      {fieldToolInventory.map(item => (
        <li key={item.id} onClick={() => handleItemSelect(item)}>
          <Item
            {...{
              item,
              isSelected: selectedItemId === item.id,
            }}
          />
        </li>
      ))}
    </ul>
  </div>
);

FieldTools.propTypes = {
  handlers: shape({
    handleItemSelect: func.isRequired,
  }).isRequired,
  state: shape({
    fieldToolInventory: array.isRequired,
    selectedItemId: string.isRequired,
  }).isRequired,
};

export default function Consumer() {
  return (
    <FarmhandContext.Consumer>
      {context => <FieldTools {...context} />}
    </FarmhandContext.Consumer>
  );
}
