import React from 'react';
import Inventory from './inventory';
import { array, func } from 'prop-types';

const Shop = ({ handlePurchaseItem, items }) => (
  <div className="shop">
    <Inventory {...{ handlePurchaseItem, items }} />
  </div>
);

Shop.propTypes = {
  items: array.isRequired,
  handlePurchaseItem: func.isRequired,
};

export default Shop;
