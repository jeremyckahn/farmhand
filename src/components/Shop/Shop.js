import React from 'react';
import Inventory from '../Inventory';
import { array, object, shape } from 'prop-types';

const Shop = ({ handlers, items, state }) => (
  <div className="Shop">
    <Inventory
      {...{
        handlers,
        isPurchaseView: true,
        items,
        state,
      }}
    />
  </div>
);

Shop.propTypes = {
  handlers: object.isRequired,
  items: array.isRequired,
  state: shape({
    valueAdjustments: object.isRequired,
  }).isRequired,
};

export default Shop;
