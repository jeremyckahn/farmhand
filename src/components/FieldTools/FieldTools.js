import React from 'react';
import { array, func, shape, string } from 'prop-types';
import Item from '../Item';
import './FieldTools.sass';

const FieldTools = ({
  handlers: { handleFieldToolSelect },
  state,
  state: { fieldToolInventory, selectedItemId },
}) => (
  <div className="FieldTools">
    <ul>
      {fieldToolInventory.map(item => (
        <li key={item.id} onClick={() => handleFieldToolSelect(item)}>
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
    handleFieldToolSelect: func.isRequired,
  }).isRequired,
  state: shape({
    fieldToolInventory: array.isRequired,
    selectedItemId: string.isRequired,
  }).isRequired,
};

export default FieldTools;
