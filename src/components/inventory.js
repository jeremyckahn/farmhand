import React from 'react';
import Item from './item';
import { array, func } from 'prop-types';

const Inventory = ({ handlePurchaseItem, items }) => (
  <div className="inventory">
    <ul>
      {items.map((item, i) => (
        <li key={i}>
          <Item {...{ item, handlePurchaseItem }} />
        </li>
      ))}
    </ul>
  </div>
);

Inventory.propTypes = {
  items: array.isRequired,
  handlePurchaseItem: func,
};

export default Inventory;
