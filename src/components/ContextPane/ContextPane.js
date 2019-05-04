import React from 'react';
import FarmhandContext from '../../Farmhand.context';
import { string } from 'prop-types';
import Toolbelt from '../Toolbelt';
import PlantableItems from '../PlantableItems';
import FieldTools from '../FieldTools';
import { stageFocusType } from '../../enums';

import './ContextPane.sass';

// TODO: Render player inventory for stageFocus === SHOP.

export const ContextPane = ({ stageFocus }) => (
  <div className="ContextPane">
    {stageFocus === stageFocusType.FIELD && (
      <>
        <header>
          <h2>Toolbelt</h2>
        </header>
        <Toolbelt />
        <header>
          <h2>Seeds</h2>
        </header>
        <PlantableItems />
        <header>
          <h2>Field Tools</h2>
        </header>
        <FieldTools />
      </>
    )}
  </div>
);

ContextPane.propTypes = {
  stageFocus: string.isRequired,
};

export default function Consumer() {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <ContextPane {...{ ...gameState, ...handlers }} />
      )}
    </FarmhandContext.Consumer>
  );
}
