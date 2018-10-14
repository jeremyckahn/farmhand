import React from 'react';
import Inventory from '../Inventory';
import { array, func, object } from 'prop-types';

const Shop = ({
  handlePurchaseItem,
  items,
  state,
  state: { money, valueAdjustments },
}) => (
  <div className="Shop">
    <Inventory
      {...{ handlePurchaseItem, items, money, state, valueAdjustments }}
    />
  </div>
);

Shop.propTypes = {
  handlePurchaseItem: func.isRequired,
  items: array.isRequired,
  state: object.isRequired,
};

export default Shop;
