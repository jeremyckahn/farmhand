import React from 'react'
import { array, number, object } from 'prop-types'

import FarmhandContext from '../../Farmhand.context'
import {
  PURCHASEABLE_COW_PENS,
  PURCHASEABLE_FIELD_SIZES,
} from '../../constants'
import Inventory from '../Inventory'
import TierPurchase from '../TierPurchase'

export const Shop = ({
  handleCowPenPurchase,
  handleFieldPurchase,
  purchasedCowPen,
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
        renderTierLabel: ({ columns, price, rows }) =>
          `$${price}: ${columns} x ${rows}`,
        tiers: PURCHASEABLE_FIELD_SIZES,
        title: 'Expand field',
      }}
    />
    <TierPurchase
      {...{
        handleTierPurchase: handleCowPenPurchase,
        purchasedTier: purchasedCowPen,
        renderTierLabel: ({ cows, price }) =>
          `$${price}: Capacity for ${cows} cows`,
        tiers: PURCHASEABLE_COW_PENS,
        title: 'Buy cow pen',
      }}
    />
  </div>
)

Shop.propTypes = {
  purchasedCowPen: number.isRequired,
  purchasedField: number.isRequired,
  shopInventory: array.isRequired,
  valueAdjustments: object.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Shop {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
