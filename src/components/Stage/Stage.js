import React from 'react';
import { array, number, object, shape, string } from 'prop-types';
import Field from '../Field';
import Inventory from '../Inventory';
import Shop from '../Shop';
import { stageFocusType } from '../../enums';

import './Stage.css';

const stageTitleMap = {
  [stageFocusType.FIELD]: 'Field',
  [stageFocusType.INVENTORY]: 'Your inventory',
  [stageFocusType.SHOP]: 'Shop',
};

const Stage = ({
  handlers,
  state,
  state: {
    fieldHeight,
    fieldWidth,
    playerInventory,
    shopInventory,
    stageFocus,
  },
}) => (
  <div className="Stage">
    <h2>{stageTitleMap[stageFocus]}</h2>
    {stageFocus === stageFocusType.FIELD && (
      <Field
        {...{
          handlers,
          columns: fieldWidth,
          rows: fieldHeight,
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
    fieldHeight: number.isRequired,
    fieldWidth: number.isRequired,
    playerInventory: array.isRequired,
    shopInventory: array.isRequired,
    stageFocus: string.isRequired,
  }).isRequired,
};

export default Stage;
