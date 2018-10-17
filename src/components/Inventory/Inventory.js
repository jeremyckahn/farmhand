import React from 'react';
import Item from '../Item';
import { getItemValue } from '../../utils';
import { array, bool, object, shape } from 'prop-types';

import './Inventory.css';

const Inventory = ({
  handlers,
  isPurchaseView,
  isSellView,
  items,
  state,
  state: { valueAdjustments },
}) => (
  <div className="Inventory">
    <ul>
      {items.map((item, i) => (
        <li key={i}>
          <Item
            {...{
              handlers,
              isPurchaseView,
              isSellView,
              item: {
                ...item,
                value: getItemValue(item, valueAdjustments),
              },
              state,
            }}
          />
        </li>
      ))}
    </ul>
  </div>
);

Inventory.propTypes = {
  handlers: object.isRequired,
  items: array.isRequired,
  isPurchaseView: bool,
  isSellView: bool,
  state: shape({
    valueAdjustments: object.isRequired,
  }).isRequired,
};

export default Inventory;
