import React from 'react';
import { string } from 'prop-types';
import Inventory from './inventory';
import Shop from './shop';
import { stageFocusType } from '../enums';

const Stage = ({ focusType }) => (
  <div className="stage">
    {focusType === stageFocusType.INVENTORY && <Inventory items={[]} />}
    {focusType === stageFocusType.SHOP && <Shop items={[]} />}
  </div>
);

Stage.propTypes = {
  focusType: string.isRequired,
};

export default Stage;
