import React from 'react';
import { string } from 'prop-types';
import PlantableItems from '../PlantableItems';
import { stageFocusType } from '../../enums';

import './ContextPane.css';

const ContextPane = ({ stageFocus }) => (
  <div className="ContextPane">
    {stageFocus === stageFocusType.FIELD && <PlantableItems />}
  </div>
);

ContextPane.propTypes = {
  stageFocus: string.isRequired,
};

export default ContextPane;
