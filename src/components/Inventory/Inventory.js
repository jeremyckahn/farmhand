import React from 'react';
import FarmhandContext from '../../Farmhand.context';
import Item from '../Item';
import { getItemValue } from '../../utils';
import { array, bool, object, shape } from 'prop-types';

import './Inventory.sass';

// TODO: Group items by category (seeds, field tools, etc.) and render headers
// for the groups.

export const Inventory = ({
  isPurchaseView,
  isSellView,
  items,
  gameState: { valueAdjustments },
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
  isPurchaseView: bool,
  isSellView: bool,
  gameState: shape({
    valueAdjustments: object.isRequired,
  }).isRequired,
};

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {context => <Inventory {...{ ...context, ...props }} />}
    </FarmhandContext.Consumer>
  );
}
