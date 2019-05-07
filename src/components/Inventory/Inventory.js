import React from 'react';
import FarmhandContext from '../../Farmhand.context';
import Item from '../Item';
import { getItemValue } from '../../utils';
import { array, object } from 'prop-types';

import './Inventory.sass';

// TODO: Group items by category (seeds, field tools, etc.) and render headers
// for the groups.

export const Inventory = ({
  items,
  playerInventory,
  shopInventory,
  valueAdjustments,

  // Infer the type of view this is by doing an identity check against
  // gameState arrays.
  isPurchaseView = items === shopInventory,
  isSellView = items === playerInventory,
}) => (
  <div className="Inventory">
    <ul>
      {items.map((item, i) => (
        <li key={i}>
          <Item
            {...{
              isPurchaseView,
              isSellView,
              item: {
                ...item,
                value: getItemValue(item, valueAdjustments),
              },
            }}
          />
        </li>
      ))}
    </ul>
  </div>
);

Inventory.propTypes = {
  items: array.isRequired,
  playerInventory: array,
  shopInventory: array,
  valueAdjustments: object.isRequired,
};

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Inventory {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  );
}
