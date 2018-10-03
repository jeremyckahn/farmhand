import React from 'react';
import { array, func, number, object, string } from 'prop-types';
import Field from '../Field';
import Inventory from '../Inventory';
import Shop from '../Shop';
import { stageFocusType } from '../../enums';

import './Stage.css';

const Stage = ({
  fieldHeight,
  fieldWidth,
  handlePurchaseItem,
  handleSellItem,
  inventory,
  money,
  shopInventory,
  stageFocus,
  valueAdjustments,
}) => (
  <div className="Stage">
    {stageFocus === stageFocusType.FIELD && (
      <Field {...{ columns: fieldWidth, rows: fieldHeight }} />
    )}
    {stageFocus === stageFocusType.INVENTORY && (
      <Inventory
        {...{ handleSellItem, items: inventory, money, valueAdjustments }}
      />
    )}
    {stageFocus === stageFocusType.SHOP && (
      <Shop
        {...{
          handlePurchaseItem,
          items: shopInventory,
          money,
          valueAdjustments,
        }}
      />
    )}
  </div>
);

Stage.propTypes = {
  fieldHeight: number.isRequired,
  fieldWidth: number.isRequired,
  handlePurchaseItem: func.isRequired,
  handleSellItem: func.isRequired,
  inventory: array.isRequired,
  money: number.isRequired,
  shopInventory: array.isRequired,
  stageFocus: string.isRequired,
  valueAdjustments: object.isRequired,
};

export default Stage;
