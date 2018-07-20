import React from 'react';
import { string } from 'prop-types';
import Inventory from './inventory';
import Shop from './shop';
import { stageFocus } from '../enums';

const Stage = ({ focusType }) => (
  <div className="stage">
    {focusType === stageFocus.INVENTORY && <Inventory items={[]} />}
    {focusType === stageFocus.SHOP && <Shop />}
  </div>
);

Stage.propTypes = {
  focusType: string.isRequired,
};

export default Stage;
