import React from 'react';
import FarmhandContext from '../../Farmhand.context';
import Inventory from '../Inventory';
import LandPurchase from '../LandPurchase';
import { array, object } from 'prop-types';

export const Shop = ({ shopInventory }) => (
  <div className="Shop">
    <Inventory
      {...{
        isPurchaseView: true,
        items: shopInventory,
      }}
    />
    <LandPurchase />
  </div>
);

Shop.propTypes = {
  shopInventory: array.isRequired,
  valueAdjustments: object.isRequired,
};

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Shop {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  );
}
