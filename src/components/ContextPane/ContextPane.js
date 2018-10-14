import React from 'react';
import { array, func, object, string } from 'prop-types';
import PlantableItems from '../PlantableItems';
import { stageFocusType } from '../../enums';

import './ContextPane.css';

const ContextPane = ({
  handleSelectPlantableItem,
  plantableInventory,
  stageFocus,
  state,
  state: { selectedPlantableItemId },
}) => (
  <div className="ContextPane">
    {stageFocus === stageFocusType.FIELD && (
      <PlantableItems
        {...{
          handleSelectPlantableItem,
          plantableInventory,
          selectedPlantableItemId,
          state,
        }}
      />
    )}
  </div>
);

ContextPane.propTypes = {
  handleSelectPlantableItem: func.isRequired,
  plantableInventory: array.isRequired,
  stageFocus: string.isRequired,
  state: object.isRequired,
};

export default ContextPane;
