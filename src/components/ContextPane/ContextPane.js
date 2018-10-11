import React from 'react';
import { array, func, string } from 'prop-types';
import PlantableItems from '../PlantableItems';
import { stageFocusType } from '../../enums';

import './ContextPane.css';

const ContextPane = ({
  handleSelectPlantableItem,
  inventory,
  selectedPlantableItemId,
  stageFocus,
}) => (
  <div className="ContextPane">
    {stageFocus === stageFocusType.FIELD && (
      <PlantableItems
        {...{
          handleSelectPlantableItem,
          inventory,
          selectedPlantableItemId,
        }}
      />
    )}
  </div>
);

ContextPane.propTypes = {
  handleSelectPlantableItem: func.isRequired,
  inventory: array.isRequired,
  selectedPlantableItemId: string.isRequired,
  stageFocus: string.isRequired,
};

export default ContextPane;
