import React from 'react';
import Inventory from '../Inventory';
import LandPurchase from '../LandPurchase';
import { array, number, object, shape } from 'prop-types';

const Shop = ({ handlers, items, state, state: { purchasedField } }) => (
  <div className="Shop">
    <Inventory
      {...{
        handlers,
        isPurchaseView: true,
        items,
        state,
      }}
    />
    <LandPurchase
      {...{
        handlers,
        purchasedField,
        state,
      }}
    />
  </div>
);

Shop.propTypes = {
  handlers: object.isRequired,
  items: array.isRequired,
  state: shape({
    purchasedField: number.isRequired,
    valueAdjustments: object.isRequired,
  }).isRequired,
};

export default Shop;
