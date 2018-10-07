import React from 'react';
import { array, string } from 'prop-types';
import PlantableItems from '../PlantableItems';
import { stageFocusType } from '../../enums';

import './ContextPane.css';

const ContextPane = ({ inventory, stageFocus }) => (
  <div className="ContextPane">
    {stageFocus === stageFocusType.FIELD && (
      <PlantableItems {...{ inventory }} />
    )}
  </div>
);

ContextPane.propTypes = {
  inventory: array.isRequired,
  stageFocus: string.isRequired,
};

export default ContextPane;
