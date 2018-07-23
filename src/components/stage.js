import React from 'react';
import { array, func, number, string } from 'prop-types';
import Inventory from './inventory';
import Shop from './shop';
import { stageFocusType } from '../enums';

const Stage = ({ focusType, handlePurchaseItem, money, shopInventory }) => (
  <div className="stage">
    {focusType === stageFocusType.INVENTORY && (
      <Inventory {...{ items: [], money }} />
    )}
    {focusType === stageFocusType.SHOP && (
      <Shop {...{ handlePurchaseItem, items: shopInventory, money }} />
    )}
  </div>
);

Stage.propTypes = {
  focusType: string.isRequired,
  handlePurchaseItem: func.isRequired,
  money: number.isRequired,
  shopInventory: array.isRequired,
};

export default Stage;
