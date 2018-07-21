import React from 'react';
import { array, string } from 'prop-types';
import Inventory from './inventory';
import Shop from './shop';
import { stageFocusType } from '../enums';

const Stage = ({ focusType, shopInventory }) => (
  <div className="stage">
    {focusType === stageFocusType.INVENTORY && <Inventory items={[]} />}
    {focusType === stageFocusType.SHOP && <Shop items={shopInventory} />}
  </div>
);

Stage.propTypes = {
  focusType: string.isRequired,
  shopInventory: array.isRequired,
};

export default Stage;
