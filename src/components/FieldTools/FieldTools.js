import React from 'react';
import { array, func, shape, string } from 'prop-types';
import Item from '../Item';
import './FieldTools.sass';

const FieldTools = ({
  handlers: { handleItemSelect },
  state,
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
              state,
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

export default FieldTools;
