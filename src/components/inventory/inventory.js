import React from 'react';
import Item from '../item';
import { getItemValue } from '../../utils';
import { array, func, number, object } from 'prop-types';

import './inventory.css';

const Inventory = ({
  handlePurchaseItem,
  handleSellItem,
  items,
  money,
  valueAdjustments,
}) => (
  <div className="inventory">
    <ul>
      {items.map((item, i) => (
        <li key={i}>
          <Item
            {...{
              handlePurchaseItem,
              handleSellItem,
              item: { ...item, value: getItemValue(item, valueAdjustments) },
              money,
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
  money: number.isRequired,
  valueAdjustments: object.isRequired,
};

export default Inventory;
