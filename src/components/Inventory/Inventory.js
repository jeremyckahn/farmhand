import React from 'react';
import Item from '../Item';
import { getItemValue } from '../../utils';
import { array, func, object } from 'prop-types';

import './Inventory.css';

const Inventory = ({
  handlePurchaseItem,
  handleSellItem,
  items,
  state,
  state: { money },
  valueAdjustments,
}) => (
  <div className="Inventory">
    <ul>
      {items.map((item, i) => (
        <li key={i}>
          <Item
            {...{
              handlePurchaseItem,
              handleSellItem,
              item: { ...item, value: getItemValue(item, valueAdjustments) },
              money,
              state,
            }}
          />
        </li>
      ))}
    </ul>
  </div>
);

Inventory.propTypes = {
  handlePurchaseItem: func,
  handleSellItem: func,
  items: array.isRequired,
  state: object.isRequired,
  valueAdjustments: object.isRequired,
};

export default Inventory;
