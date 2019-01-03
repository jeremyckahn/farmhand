import React from 'react';
import { object, shape, string } from 'prop-types';
import Toolbelt from '../Toolbelt';
import PlantableItems from '../PlantableItems';
import FieldTools from '../FieldTools';
import { stageFocusType } from '../../enums';

import './ContextPane.sass';

const ContextPane = ({ handlers, state, state: { stageFocus } }) => (
  <div className="ContextPane">
    {stageFocus === stageFocusType.FIELD && (
      <>
        <Toolbelt {...{ handlers, state }} />
        <PlantableItems {...{ handlers, state }} />
        <FieldTools {...{ handlers, state }} />
      </>
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
