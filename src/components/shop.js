import React from 'react';
import Inventory from './inventory';
import { array, func, number, object } from 'prop-types';

const Shop = ({ handlePurchaseItem, items, money, valueAdjustments }) => (
  <div className="shop">
    <Inventory {...{ handlePurchaseItem, items, money, valueAdjustments }} />
  </div>
);

Shop.propTypes = {
  handlePurchaseItem: func.isRequired,
  items: array.isRequired,
  money: number.isRequired,
  valueAdjustments: object.isRequired,
};

export default Shop;
