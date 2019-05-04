import React from 'react';
import FarmhandContext from '../../Farmhand.context';
import Item from '../Item';
import { getItemValue } from '../../utils';
import { array, bool, object } from 'prop-types';

import './Inventory.sass';

// TODO: Group items by category (seeds, field tools, etc.) and render headers
// for the groups.

// TODO: This component should determine its `items` based on isPurchaseView
// and isSellView, not the props provided to it.

export const Inventory = ({
  isPurchaseView,
  isSellView,
  items,
  valueAdjustments,
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
  isPurchaseView: bool,
  isSellView: bool,
  items: array.isRequired,
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
