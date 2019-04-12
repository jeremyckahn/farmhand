import React from 'react';
import { object, shape, string } from 'prop-types';
import Toolbelt from '../Toolbelt';
import PlantableItems from '../PlantableItems';
import FieldTools from '../FieldTools';
import { stageFocusType } from '../../enums';

import './ContextPane.sass';

// TODO: Render player inventory for stageFocus === SHOP.

const ContextPane = ({ handlers, state, state: { stageFocus } }) => (
  <div className="ContextPane">
    {stageFocus === stageFocusType.FIELD && (
      <>
        <header>
          <h2>Toolbelt</h2>
        </header>
        <Toolbelt {...{ handlers, state }} />
        <header>
          <h2>Seeds</h2>
        </header>
        <PlantableItems {...{ handlers, state }} />
        <header>
          <h2>Field Tools</h2>
        </header>
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
