import React from 'react';
import FarmhandContext from '../../Farmhand.context';
import Inventory from '../Inventory';
import LandPurchase from '../LandPurchase';
import { array, number, object, shape } from 'prop-types';

export const Shop = ({ items, gameState: { purchasedField } }) => (
  <div className="Shop">
    <Inventory
      {...{
        isPurchaseView: true,
        items,
      }}
    />
    <LandPurchase
      {...{
        purchasedField,
      }}
    />
  </div>
);

Shop.propTypes = {
  items: array.isRequired,
  gameState: shape({
    purchasedField: number.isRequired,
    valueAdjustments: object.isRequired,
  }).isRequired,
};

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {context => <Shop {...{ ...context, ...props }} />}
    </FarmhandContext.Consumer>
  );
}
