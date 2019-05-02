import React from 'react';
import FarmhandContext from '../../Farmhand.context';
import { array, arrayOf, shape, string } from 'prop-types';
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

export const Stage = ({
  gameState: { field, playerInventory, shopInventory, stageFocus },
}) => (
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
          isSellView: true,
          items: playerInventory,
        }}
      />
    )}
    {stageFocus === stageFocusType.SHOP && (
      <Shop
        {...{
          items: shopInventory,
        }}
      />
    )}
  </div>
);

Stage.propTypes = {
  gameState: shape({
    field: arrayOf(array).isRequired,
    playerInventory: array.isRequired,
    shopInventory: array.isRequired,
    stageFocus: string.isRequired,
  }).isRequired,
};

export default function Consumer() {
  return (
    <FarmhandContext.Consumer>
      {context => <Stage {...context} />}
    </FarmhandContext.Consumer>
  );
}
