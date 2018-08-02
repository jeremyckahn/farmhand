import React from 'react';
import { array, func, number, object, string } from 'prop-types';
import Inventory from './inventory';
import Shop from './shop';
import { stageFocusType } from '../enums';

const Stage = ({
  focusType,
  handlePurchaseItem,
  inventory,
  money,
  shopInventory,
  valueAdjustments,
}) => (
  <div className="stage">
    {focusType === stageFocusType.INVENTORY && (
      <Inventory {...{ items: inventory, money, valueAdjustments }} />
    )}
    {focusType === stageFocusType.SHOP && (
      <Shop {...{ handlePurchaseItem, items: shopInventory, money, valueAdjustments }} />
    )}
  </div>
);

Stage.propTypes = {
  focusType: string.isRequired,
  handlePurchaseItem: func.isRequired,
  inventory: array.isRequired,
  money: number.isRequired,
  shopInventory: array.isRequired,
  valueAdjustments: object.isRequired,
};

export default Stage;
