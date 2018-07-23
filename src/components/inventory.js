import React from 'react';
import Item from './item';
import { array, func, number } from 'prop-types';

const Inventory = ({ handlePurchaseItem, items, money }) => (
  <div className="inventory">
    <ul>
      {items.map((item, i) => (
        <li key={i}>
          <Item {...{ handlePurchaseItem, item, money }} />
        </li>
      ))}
    </ul>
  </div>
);

Inventory.propTypes = {
  handlePurchaseItem: func,
  items: array.isRequired,
  money: number.isRequired,
};

export default Inventory;
