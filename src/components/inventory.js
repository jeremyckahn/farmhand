import React from 'react';
import Item from './item';
import { array } from 'prop-types';

const Inventory = ({ items }) => (
  <div className="inventory">
    <ul>
      {items.map((item, i) => (
        <li key={i}>
          <Item {...item} />
        </li>
      ))}
    </ul>
  </div>
);

Inventory.propTypes = {
  items: array.isRequired,
};

export default Inventory;
