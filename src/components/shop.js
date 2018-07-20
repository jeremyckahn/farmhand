import React from 'react';
import Inventory from './inventory';
import { array } from 'prop-types';

const Shop = ({ items }) => (
  <div className="shop">
    <Inventory {...{ items }} />
  </div>
);

Shop.propTypes = { items: array.isRequired };

export default Shop;
