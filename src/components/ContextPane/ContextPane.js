import React from 'react';
import { object, shape, string } from 'prop-types';
import PlantableItems from '../PlantableItems';
import { stageFocusType } from '../../enums';

import './ContextPane.sass';

const ContextPane = ({ handlers, state, state: { stageFocus } }) => (
  <div className="ContextPane">
    {stageFocus === stageFocusType.FIELD && (
      <PlantableItems {...{ handlers, state }} />
    )}
  </div>
);

ContextPane.propTypes = {
  handlers: object.isRequired,
  state: shape({
    stageFocus: string.isRequired,
  }).isRequired,
};

export default ContextPane;
