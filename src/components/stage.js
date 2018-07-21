import React from 'react';
import { array, func, string } from 'prop-types';
import Inventory from './inventory';
import Shop from './shop';
import { stageFocusType } from '../enums';

const Stage = ({ focusType, handlePurchaseItem, shopInventory }) => (
  <div className="stage">
    {focusType === stageFocusType.INVENTORY && <Inventory items={[]} />}
    {focusType === stageFocusType.SHOP && (
      <Shop {...{ handlePurchaseItem, items: shopInventory }} />
    )}
  </div>
);

Stage.propTypes = {
  focusType: string.isRequired,
  handlePurchaseItem: func.isRequired,
  shopInventory: array.isRequired,
};

export default Stage;
