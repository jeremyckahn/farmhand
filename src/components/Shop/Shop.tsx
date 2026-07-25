import React from 'react'
import { array, func, number, object } from 'prop-types'
import Button from '@mui/material/Button/index.js'
import Card from '@mui/material/Card/index.js'
import CardActions from '@mui/material/CardActions/index.js'
import CardContent from '@mui/material/CardContent/index.js'
import CardHeader from '@mui/material/CardHeader/index.js'
import Tab from '@mui/material/Tab/index.js'
import Tabs from '@mui/material/Tabs/index.js'
import Typography from '@mui/material/Typography/index.js'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import { moneyString } from '../../utils/moneyString.js'
import { dollarString } from '../../utils/dollarString.js'
import { getCostOfNextStorageExpansion } from '../../utils/getCostOfNextStorageExpansion.js'
import { integerString } from '../../utils/integerString.js'
import { memoize } from '../../utils/memoize.js'
import { items } from '../../img/index.js'
import { itemType, stageFocusType, toolType } from '../../enums.js'
import {
  INFINITE_STORAGE_LIMIT,
  PURCHASEABLE_CELLARS,
  PURCHASEABLE_COMBINES,
  PURCHASEABLE_COMPOSTERS,
  PURCHASEABLE_COW_PENS,
  PURCHASEABLE_FIELD_SIZES,
  PURCHASABLE_FOREST_SIZES,
  PURCHASEABLE_SMELTERS,
  PURCHASEABLE_WOOD_CHIPPERS,
  STORAGE_EXPANSION_AMOUNT,
} from '../../constants.js'
import Inventory from '../Inventory/index.js'
import TierPurchase from '../TierPurchase/index.js'
import { Div } from '../Elements/index.js'
import { centerTabsSx } from '../../styles/sx.js'
import { useTabQueryParam } from '../../hooks/useTabQueryParam.js'

import { TabPanel, a11yProps } from './TabPanel/index.js'

const getShopCategory = (
  item: farmhand.item
): 'seeds' | 'saplings' | 'fieldTools' => {
  if (item.type === itemType.CROP) return 'seeds'
  if (item.type === itemType.TREE && item.isPlantableTree) return 'saplings'
  return 'fieldTools'
}

const categorizeShopInventory = memoize(
  (
    shopInventory: farmhand.item[]
  ): Record<'seeds' | 'saplings' | 'fieldTools', farmhand.item[]> =>
    shopInventory.reduce(
      (acc, inventoryItem) => {
        acc[getShopCategory(inventoryItem)].push(inventoryItem)

        return acc
      },
      {
        seeds: [] as farmhand.item[],
        saplings: [] as farmhand.item[],
        fieldTools: [] as farmhand.item[],
      }
    )
)

export const Shop = ({
  handleCombinePurchase,
  handleComposterPurchase,
  handleCowPenPurchase,
  handleCellarPurchase,
  handleFieldPurchase,
  handleForestPurchase,
  handleSmelterPurchase,
  handleStorageExpansionPurchase,
  handleWoodChipperPurchase,
  inventoryLimit,
  levelEntitlements,
  money,
  purchasedCombine,
  purchasedComposter,
  purchasedCowPen,
  purchasedCellar,
  purchasedField,
  purchasedForest,
  purchasedSmelter,
  purchasedWoodChipper,
  shopInventory,
  toolLevels,
  valueAdjustments,

  storageUpgradeCost = getCostOfNextStorageExpansion(inventoryLimit),
}: {
  handleCombinePurchase: (id: number) => void
  handleComposterPurchase: (id: number) => void
  handleCowPenPurchase: (id: number) => void
  handleCellarPurchase: (id: number) => void
  handleFieldPurchase: (id: number) => void
  handleForestPurchase: (id: number) => void
  handleSmelterPurchase: (id: number) => void
  handleStorageExpansionPurchase: () => void
  handleWoodChipperPurchase: (id: number) => void
  inventoryLimit: number
  levelEntitlements: farmhand.levelEntitlements
  money: number
  purchasedCombine: number
  purchasedComposter: number
  purchasedCowPen: number
  purchasedCellar: number
  purchasedField: number
  purchasedForest: number
  purchasedSmelter: number
  purchasedWoodChipper: number
  shopInventory: farmhand.item[]
  toolLevels: Record<string, string>
  valueAdjustments: Record<string, number>
  storageUpgradeCost?: number
}) => {
  const { seeds, saplings, fieldTools } = categorizeShopInventory(shopInventory)

  const isForestUnlocked =
    levelEntitlements.stageFocusType[stageFocusType.FOREST]

  const showSaplings = isForestUnlocked && saplings.length > 0

  const suppliesTabIndex = showSaplings ? 2 : 1
  const upgradesTabIndex = showSaplings ? 3 : 2

  const [currentTab, setCurrentTab] = useTabQueryParam(
    ['Seeds', showSaplings ? 'Saplings' : '', 'Supplies', 'Upgrades'].filter(
      Boolean
    )
  )

  return (
    <Div className="Shop" sx={centerTabsSx}>
      <Tabs
        value={currentTab}
        onChange={(_e, newTab) => setCurrentTab(newTab)}
        aria-label="Shop tabs"
      >
        <Tab {...{ label: 'Seeds', ...a11yProps(0) }} />
        {showSaplings ? (
          <Tab {...{ label: 'Saplings', ...a11yProps(1) }} />
        ) : null}
        <Tab {...{ label: 'Supplies', ...a11yProps(suppliesTabIndex) }} />
        <Tab {...{ label: 'Upgrades', ...a11yProps(upgradesTabIndex) }} />
      </Tabs>
      <TabPanel value={currentTab} index={0}>
        <Inventory
          {...{
            items: seeds,
            isPurchaseView: true,
            placeholder: 'Search seeds...',
          }}
        />
      </TabPanel>
      {showSaplings ? (
        <TabPanel value={currentTab} index={1}>
          <Inventory
            {...{
              items: saplings,
              isPurchaseView: true,
              placeholder: 'Search saplings...',
            }}
          />
        </TabPanel>
      ) : null}
      <TabPanel value={currentTab} index={suppliesTabIndex}>
        <Inventory
          {...{
            items: fieldTools,
            isPurchaseView: true,
            placeholder: 'Search supplies...',
          }}
        />
      </TabPanel>
      <TabPanel value={currentTab} index={upgradesTabIndex}>
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
                renderTierLabel: ({
                  columns,
                  price,
                  rows,
                }: {
                  columns: number
                  price: number
                  rows: number
                }) => `${dollarString(price)}: ${columns} x ${rows}`,
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
                renderTierLabel: ({
                  cows,
                  price,
                }: {
                  cows: number
                  price: number
                }) => `${dollarString(price)}: ${cows} cow pen`,
                tiers: PURCHASEABLE_COW_PENS,
                title: 'Buy cow pen',
              }}
            />
          </li>
          <li>
            <TierPurchase
              {...{
                onBuyClick: handleCellarPurchase,
                maxedOutPlaceholder:
                  "You've purchased the largest cellar available!",
                purchasedTier: purchasedCellar,
                renderTierLabel: ({
                  space,
                  price,
                }: {
                  space: number
                  price: number
                }) => `${dollarString(price)}: Space for ${space} kegs`,
                tiers: PURCHASEABLE_CELLARS,
                title: 'Buy cellar',
              }}
            />
          </li>
          {isForestUnlocked ? (
            <li>
              <TierPurchase
                {...{
                  onBuyClick: handleForestPurchase,
                  maxedOutPlaceholder:
                    "You've purchased the largest forest available!",
                  purchasedTier: purchasedForest,
                  renderTierLabel: ({
                    columns,
                    price,
                    rows,
                  }: {
                    columns: number
                    price: number
                    rows: number
                  }) => `${dollarString(price)}: ${columns} x ${rows}`,
                  tiers: PURCHASABLE_FOREST_SIZES,
                  title: 'Expand forest',
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
                renderTierLabel: ({
                  type,
                  price,
                }: {
                  type: string
                  price: number
                }) => `${dollarString(price)}: ${type} combine harvester`,
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
                  renderTierLabel: ({
                    type,
                    price,
                  }: {
                    type: string
                    price: number
                  }) => `${dollarString(price)}: ${type} Smelter`,
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
                renderTierLabel: ({
                  type,
                  price,
                }: {
                  type: string
                  price: number
                }) => `${dollarString(price)}: ${type} Composter`,
                tiers: PURCHASEABLE_COMPOSTERS,
                title: 'Buy composter',
              }}
            />
          </li>
          {isForestUnlocked ? (
            <li>
              <TierPurchase
                {...{
                  description:
                    'You can purchase a Wood Chipper to turn wood into wood chips for making mulch.',
                  onBuyClick: handleWoodChipperPurchase,
                  maxedOutPlaceholder:
                    "You've already purchased the wood chipper!",
                  purchasedTier: purchasedWoodChipper,
                  renderTierLabel: ({
                    type,
                    price,
                  }: {
                    type: string
                    price: number
                  }) => `${dollarString(price)}: ${type} Wood Chipper`,
                  tiers: PURCHASEABLE_WOOD_CHIPPERS,
                  title: 'Buy wood chipper',
                }}
              />
            </li>
          ) : null}
        </ul>
      </TabPanel>
    </Div>
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
  purchasedWoodChipper: number.isRequired,
  purchasedCombine: number.isRequired,
  shopInventory: array.isRequired,
  toolLevels: object.isRequired,
  valueAdjustments: object.isRequired,
}

export default function Consumer(props: Partial<Parameters<typeof Shop>[0]>) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Shop
          {...({
            ...gameState,
            ...handlers,
            ...props,
          } as Parameters<typeof Shop>[0])}
        />
      )}
    </FarmhandContext.Consumer>
  )
}
