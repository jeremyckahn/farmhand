import React from 'react';
import Inventory from './inventory';
import { array, func, number } from 'prop-types';

const Shop = ({ handlePurchaseItem, items, money }) => (
  <div className="shop">
    <Inventory {...{ handlePurchaseItem, items, money }} />
  </div>
);

Shop.propTypes = {
  handlePurchaseItem: func.isRequired,
  items: array.isRequired,
  money: number.isRequired,
};

export default Shop;
