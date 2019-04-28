import React from 'react';
import { array, arrayOf, object, shape, string } from 'prop-types';
import Field from '../Field';
import Inventory from '../Inventory';
import Shop from '../Shop';
import { stageFocusType } from '../../enums';

import './Stage.sass';

const stageTitleMap = {
  [stageFocusType.FIELD]: 'Field',
  [stageFocusType.INVENTORY]: 'Your inventory',
  [stageFocusType.SHOP]: 'Shop',
};

const Stage = ({
  handlers,
  state,
  state: { field, playerInventory, shopInventory, stageFocus },
}) => (
  <div className="Stage">
    <h2>{stageTitleMap[stageFocus]}</h2>
    {stageFocus === stageFocusType.FIELD && (
      <Field
        {...{
          handlers,
          columns: field[0].length,
          rows: field.length,
          state,
        }}
      />
    )}
    {stageFocus === stageFocusType.INVENTORY && (
      <Inventory
        {...{
          handlers,
          isSellView: true,
          items: playerInventory,
          state,
        }}
      />
    )}
    {stageFocus === stageFocusType.SHOP && (
      <Shop
        {...{
          handlers,
          items: shopInventory,
          state,
        }}
      />
    )}
  </div>
);

Stage.propTypes = {
  handlers: object.isRequired,
  state: shape({
    field: arrayOf(array).isRequired,
    playerInventory: array.isRequired,
    shopInventory: array.isRequired,
    stageFocus: string.isRequired,
  }).isRequired,
};

export default Stage;
