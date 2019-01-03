import React from 'react';
import { array, func, shape, string } from 'prop-types';
import Item from '../Item';
import './FieldTools.sass';

const FieldTools = ({
  handlers: { handleFieldToolSelect },
  state,
  state: { fieldToolInventory, selectedFieldToolId },
}) => (
  <div className="FieldTools">
    <ul>
      {fieldToolInventory.map(item => (
        <li key={item.id} onClick={() => handleFieldToolSelect(item)}>
          <Item
            {...{
              item,
              isSelected: selectedFieldToolId === item.id,
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
    selectedFieldToolId: string.isRequired,
  }).isRequired,
};

export default FieldTools;
