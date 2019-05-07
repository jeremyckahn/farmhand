import React from 'react';
import FarmhandContext from '../../Farmhand.context';
import { array, arrayOf, string } from 'prop-types';
import Field from '../Field';
import Inventory from '../Inventory';
import Shop from '../Shop';
import { stageFocusType } from '../../enums';

import './Stage.sass';

const stageTitleMap = {
  [stageFocusType.FIELD]: 'Field',
  [stageFocusType.INVENTORY]: 'Your inventory',
  [stageFocusType.SHOP]: 'Shop',
};

export const Stage = ({ field, playerInventory, stageFocus }) => (
  <div className="Stage">
    <h2>{stageTitleMap[stageFocus]}</h2>
    {stageFocus === stageFocusType.FIELD && (
      <Field
        {...{
          columns: field[0].length,
          rows: field.length,
        }}
      />
    )}
    {stageFocus === stageFocusType.INVENTORY && (
      <Inventory
        {...{
          items: playerInventory,
        }}
      />
    )}
    {stageFocus === stageFocusType.SHOP && <Shop />}
  </div>
);

Stage.propTypes = {
  field: arrayOf(array).isRequired,
  playerInventory: array.isRequired,
  stageFocus: string.isRequired,
};

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Stage {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  );
}
