import React from 'react';
import { array, object } from 'prop-types';

import FarmhandContext from '../../Farmhand.context';
import { PURCHASEABLE_FIELD_SIZES } from '../../constants';
import Inventory from '../Inventory';
import TierPurchase from '../TierPurchase';

export const Shop = ({
  handleFieldPurchase,
  purchasedField,
  shopInventory,
}) => (
  <div className="Shop">
    <Inventory
      {...{
        items: shopInventory,
      }}
    />
    <TierPurchase
      {...{
        handleTierPurchase: handleFieldPurchase,
        purchasedTier: purchasedField,
        tiers: PURCHASEABLE_FIELD_SIZES,
        title: 'Expand field',
      }}
    />
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
