import React from 'react'
import { array, func, number, object } from 'prop-types'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'

import FarmhandContext from '../../Farmhand.context'
import { moneyString } from '../../utils'
import { items } from '../../img'
import {
  PURCHASEABLE_COW_PENS,
  PURCHASEABLE_FIELD_SIZES,
  STORAGE_EXPANSION_AMOUNT,
  STORAGE_EXPANSION_PRICE,
} from '../../constants'
import Inventory from '../Inventory'
import TierPurchase from '../TierPurchase'

import './Shop.sass'

export const Shop = ({
  handleCowPenPurchase,
  handleFieldPurchase,
  handleStorageExpansionPurchase,
  inventoryLimit,
  money,
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
    <ul className="card-list">
      {inventoryLimit > -1 && (
        <li>
          <Card>
            <CardHeader
              {...{
                avatar: (
                  <img
                    {...{ src: items['inventory-box'] }}
                    alt={'Inventory box'}
                  />
                ),
                title: 'Storage Unit',
                subheader: (
                  <div>
                    <p>Price: {moneyString(STORAGE_EXPANSION_PRICE)}</p>
                    <p>Current inventory space: {inventoryLimit}</p>
                  </div>
                ),
              }}
            />
            <CardContent>
              <Typography>
                Purchase a Storge Unit to increase your inventory capacity for{' '}
                {STORAGE_EXPANSION_AMOUNT} more items.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                {...{
                  disabled: money < STORAGE_EXPANSION_PRICE,
                  color: 'primary',
                  onClick: handleStorageExpansionPurchase,
                  variant: 'contained',
                }}
              >
                Buy
              </Button>
            </CardActions>
          </Card>
        </li>
      )}

      <li>
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
      </li>
      <li>
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
      </li>
    </ul>
  </div>
)

Shop.propTypes = {
  handleCowPenPurchase: func.isRequired,
  handleFieldPurchase: func.isRequired,
  handleStorageExpansionPurchase: func.isRequired,
  inventoryLimit: number.isRequired,
  money: number.isRequired,
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
