import React from 'react';
import { array, object, string } from 'prop-types';
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
  playerInventory,
  stageFocus,
  state,
  state: {
    fieldHeight,
    fieldWidth,
    money,
    selectedPlantableItemId,
    shopInventory,
    valueAdjustments,
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
          selectedPlantableItemId,
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
          money,
          state,
          valueAdjustments,
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
  playerInventory: array.isRequired,
  stageFocus: string.isRequired,
  state: object.isRequired,
};

export default Stage;
