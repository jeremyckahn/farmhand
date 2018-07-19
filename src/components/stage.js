import React from 'react';
import { string } from 'prop-types';
import Inventory from './inventory';
import { stageFocus } from '../enums';

const Stage = ({ focusType }) => (
  <div className="stage">
    {focusType === stageFocus.INVENTORY && <Inventory items={[]} />}
  </div>
);

Stage.propTypes = {
  focusType: string.isRequired,
};

export default Stage;
