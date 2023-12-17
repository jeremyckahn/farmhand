import React, { useState } from 'react'
import { array, func, number, object } from 'prop-types'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'

import FarmhandContext from '../Farmhand/Farmhand.context'
import { features } from '../../config'
import { moneyString } from '../../utils/moneyString'
import {
  dollarString,
  getCostOfNextStorageExpansion,
  integerString,
} from '../../utils'
import { memoize } from '../../utils/memoize'
import { items } from '../../img'
import { itemType, toolType } from '../../enums'
import {
  INFINITE_STORAGE_LIMIT,
  PURCHASEABLE_CELLARS,
  PURCHASEABLE_COMBINES,
  PURCHASEABLE_COMPOSTERS,
  PURCHASEABLE_COW_PENS,
  PURCHASEABLE_FIELD_SIZES,
  PURCHASEABLE_SMELTERS,
  STORAGE_EXPANSION_AMOUNT,
} from '../../constants'
import Inventory from '../Inventory'
import TierPurchase from '../TierPurchase'

import { TabPanel, a11yProps } from './TabPanel'

import './Shop.sass'

/**
 * @param {Array.<farmhand.item>} shopInventory
 * @returns {Object.<'seeds' | 'fieldTools', Array.<farmhand.item>>}
 */
const categorizeShopInventory = memoize(shopInventory =>
  shopInventory.reduce(
    (acc, inventoryItem) => {
      acc[inventoryItem.type === itemType.CROP ? 'seeds' : 'fieldTools'].push(
        inventoryItem
      )

      return acc
    },
    { seeds: [], fieldTools: [] }
  )
)

export const Shop = ({
  handleCombinePurchase,
  handleComposterPurchase,
  handleCowPenPurchase,
  handleCellarPurchase,
  handleFieldPurchase,
  handleSmelterPurchase,
  handleStorageExpansionPurchase,
  inventoryLimit,
  money,
  purchasedCombine,
  purchasedComposter,
  purchasedCowPen,
  purchasedCellar,
  purchasedField,
  purchasedSmelter,
  shopInventory,
  toolLevels,

  storageUpgradeCost = getCostOfNextStorageExpansion(inventoryLimit),
}) => {
  const [currentTab, setCurrentTab] = useState(0)

  const { seeds, fieldTools } = categorizeShopInventory(shopInventory)

  return (
    <div className="Shop">
      <Tabs
        value={currentTab}
        onChange={(_e, newTab) => setCurrentTab(newTab)}
        aria-label="Shop tabs"
      >
        <Tab {...{ label: 'Seeds', ...a11yProps(0) }} />
        <Tab {...{ label: 'Supplies', ...a11yProps(1) }} />
        <Tab {...{ label: 'Upgrades', ...a11yProps(2) }} />
      </Tabs>
      <TabPanel value={currentTab} index={0}>
        <Inventory
          {...{
            items: seeds,
            isPurchaseView: true,
          }}
        />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <Inventory
          {...{
            items: fieldTools,
            isPurchaseView: true,
          }}
        />
      </TabPanel>
      <TabPanel value={currentTab} index={2}>
        <ul className="card-list">
          {inventoryLimit > INFINITE_STORAGE_LIMIT && (
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
                        <p>Price: {moneyString(storageUpgradeCost)}</p>
                        <p>
                          Current inventory space:{' '}
                          {integerString(inventoryLimit)}
                        </p>
                      </div>
                    ),
                  }}
                />
                <CardContent>
                  <Typography>
                    Purchase a Storage Unit to increase your inventory capacity
                    for {STORAGE_EXPANSION_AMOUNT} more items.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    {...{
                      disabled: money < storageUpgradeCost,
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
                onBuyClick: handleFieldPurchase,
                maxedOutPlaceholder:
                  "You've purchased the largest field available!",
                purchasedTier: purchasedField,
                renderTierLabel: ({ columns, price, rows }) =>
                  `${dollarString(price)}: ${columns} x ${rows}`,
                tiers: PURCHASEABLE_FIELD_SIZES,
                title: 'Expand field',
              }}
            />
          </li>
          <li>
            <TierPurchase
              {...{
                onBuyClick: handleCowPenPurchase,
                maxedOutPlaceholder:
                  "You've purchased the largest cow pen available!",
                purchasedTier: purchasedCowPen,
                renderTierLabel: ({ cows, price }) =>
                  `${dollarString(price)}: ${cows} cow pen`,
                tiers: PURCHASEABLE_COW_PENS,
                title: 'Buy cow pen',
              }}
            />
          </li>
          {features.KEGS ? (
            <li>
              <TierPurchase
                {...{
                  onBuyClick: handleCellarPurchase,
                  maxedOutPlaceholder:
                    "You've purchased the largest cellar available!",
                  purchasedTier: purchasedCellar,
                  renderTierLabel: ({ space, price }) =>
                    `${dollarString(price)}: Space for ${space} kegs`,
                  tiers: PURCHASEABLE_CELLARS,
                  title: 'Buy cellar',
                }}
              />
            </li>
          ) : null}
          <li>
            <TierPurchase
              {...{
                description:
                  'You can purchase a combine to automatically harvest your mature crops at the start of every day.',
                onBuyClick: handleCombinePurchase,
                maxedOutPlaceholder:
                  "You've purchased the best combine harvester available!",
                purchasedTier: purchasedCombine,
                renderTierLabel: ({ type, price }) =>
                  `${dollarString(price)}: ${type} combine harvester`,
                tiers: PURCHASEABLE_COMBINES,
                title: 'Buy combine harvester',
              }}
            />
          </li>
          {toolLevels[toolType.SHOVEL] ? (
            <li>
              <TierPurchase
                {...{
                  description:
                    'You can purchase a Smelter to convert ore into ingots and other useful items.',
                  onBuyClick: handleSmelterPurchase,
                  maxedOutPlaceholder: "You've already purchased the smelter!",
                  purchasedTier: purchasedSmelter,
                  renderTierLabel: ({ type, price }) =>
                    `${dollarString(price)}: ${type} Smelter`,
                  tiers: PURCHASEABLE_SMELTERS,
                  title: 'Buy smelter',
                }}
              />
            </li>
          ) : null}
          <li>
            <TierPurchase
              {...{
                description:
                  'You can purchase a Composter to turn weeds into fertilizer.',
                onBuyClick: handleComposterPurchase,
                maxedOutPlaceholder: "You've already purchased the composter!",
                purchasedTier: purchasedComposter,
                renderTierLabel: ({ type, price }) =>
                  `${dollarString(price)}: ${type} Composter`,
                tiers: PURCHASEABLE_COMPOSTERS,
                title: 'Buy composter',
              }}
            />
          </li>
        </ul>
      </TabPanel>
    </div>
  )
}

Shop.propTypes = {
  handleCombinePurchase: func.isRequired,
  handleCowPenPurchase: func.isRequired,
  handleCellarPurchase: func.isRequired,
  handleFieldPurchase: func.isRequired,
  handleStorageExpansionPurchase: func.isRequired,
  inventoryLimit: number.isRequired,
  money: number.isRequired,
  purchasedCowPen: number.isRequired,
  purchasedCellar: number.isRequired,
  purchasedField: number.isRequired,
  purchasedSmelter: number.isRequired,
  purchasedCombine: number.isRequired,
  shopInventory: array.isRequired,
  toolLevels: object.isRequired,
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
