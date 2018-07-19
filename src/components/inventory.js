import React from 'react';
import { array } from 'prop-types';

const Inventory = ({ items }) => (
  <div className="inventory">
    <ul>{items.map((item, i) => <li key={i} />)}</ul>
  </div>
);

Inventory.propTypes = {
  items: array.isRequired,
};

export default Inventory;
