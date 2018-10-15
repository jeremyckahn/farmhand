import React from 'react';
import { array, object, string } from 'prop-types';
import PlantableItems from '../PlantableItems';
import { stageFocusType } from '../../enums';

import './ContextPane.css';

const ContextPane = ({
  handlers,
  plantableInventory,
  stageFocus,
  state,
  state: { selectedPlantableItemId },
}) => (
  <div className="ContextPane">
    {stageFocus === stageFocusType.FIELD && (
      <PlantableItems
        {...{
          handlers,
          plantableInventory,
          selectedPlantableItemId,
          state,
        }}
      />
    )}
  </div>
);

ContextPane.propTypes = {
  handlers: object.isRequired,
  plantableInventory: array.isRequired,
  stageFocus: string.isRequired,
  state: object.isRequired,
};

export default ContextPane;
