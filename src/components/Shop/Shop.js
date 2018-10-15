import React from 'react';
import Inventory from '../Inventory';
import { array, object } from 'prop-types';

const Shop = ({
  handlers,
  items,
  state,
  state: { money, valueAdjustments },
}) => (
  <div className="Shop">
    <Inventory
      {...{
        handlers,
        isPurchaseView: true,
        items,
        money,
        state,
        valueAdjustments,
      }}
    />
  </div>
);

Shop.propTypes = {
  handlers: object.isRequired,
  items: array.isRequired,
  state: object.isRequired,
};

export default Shop;
