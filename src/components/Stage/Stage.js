import React from 'react';
import classNames from 'classnames';
import { array, arrayOf, bool, string } from 'prop-types';

import FarmhandContext from '../../Farmhand.context';
import Field from '../Field';
import Inventory from '../Inventory';
import Shop from '../Shop';
import { stageFocusType } from '../../enums';

import './Stage.sass';

export const Stage = ({ field, isMenuOpen, playerInventory, stageFocus }) => (
  <div className={classNames('Stage', { 'menu-closed': !isMenuOpen })}>
    {stageFocus === stageFocusType.FIELD && (
      <Field
        {...{
          columns: field[0].length,
          rows: field.length,
        }}
      />
    )}
    {stageFocus === stageFocusType.SHOP && <Shop />}
    {stageFocus === stageFocusType.INVENTORY && (
      <Inventory
        {...{
          items: playerInventory,
        }}
      />
    )}
  </div>
);

Stage.propTypes = {
  field: arrayOf(array).isRequired,
  isMenuOpen: bool.isRequired,
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
