import React from 'react';
import { string } from 'prop-types';

import FarmhandContext from '../../Farmhand.context';
import Inventory from '../Inventory';
import Toolbelt from '../Toolbelt';
import PlantableItems from '../PlantableItems';
import FieldTools from '../FieldTools';
import CowPenContextMenu from '../CowPenContextMenu';
import { stageFocusType } from '../../enums';

import './ContextPane.sass';

export const ContextPane = ({ playerInventory, stageFocus }) => (
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
    {stageFocus === stageFocusType.SHOP && (
      <Inventory
        {...{
          items: playerInventory,
        }}
      />
    )}
    {stageFocus === stageFocusType.COW_PEN && <CowPenContextMenu />}
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
