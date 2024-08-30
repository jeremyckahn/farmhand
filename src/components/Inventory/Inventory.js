import React, { Fragment } from 'react'
import { array } from 'prop-types'
import Divider from '@mui/material/Divider'

import FarmhandContext from '../Farmhand/Farmhand.context'
import Item from '../Item'
import { itemsMap } from '../../data/maps'
import { enumify, itemType } from '../../enums'
import { sortItems } from '../../utils'

import './Inventory.sass'

const {
  COW_FEED,
  CRAFTED_ITEM,
  CROP,
  FERTILIZER,
  HUGGING_MACHINE,
  MILK,
  ORE,
  SCARECROW,
  SPRINKLER,
  STONE,
  FUEL,
  TOOL_UPGRADE,
  WEED,
} = itemType

export const categoryIds = enumify([
  'ANIMAL_PRODUCTS',
  'ANIMAL_SUPPLIES',
  'CRAFTED_ITEMS',
  'CROPS',
  'FIELD_TOOLS',
  'FORAGED_ITEMS',
  'MINED_RESOURCES',
  'SEEDS',
  'UPGRADES',
])
const categoryIdKeys = Object.keys(categoryIds)
const {
  ANIMAL_PRODUCTS,
  ANIMAL_SUPPLIES,
  CRAFTED_ITEMS,
  CROPS,
  FIELD_TOOLS,
  FORAGED_ITEMS,
  MINED_RESOURCES,
  SEEDS,
  UPGRADES,
} = categoryIds

const itemTypeCategoryMap = Object.freeze({
  SEEDS,
  [COW_FEED]: ANIMAL_SUPPLIES,
  [CRAFTED_ITEM]: CRAFTED_ITEMS,
  [CROP]: CROPS,
  [FERTILIZER]: FIELD_TOOLS,
  [FUEL]: MINED_RESOURCES,
  [HUGGING_MACHINE]: ANIMAL_SUPPLIES,
  [MILK]: ANIMAL_PRODUCTS,
  [ORE]: MINED_RESOURCES,
  [SCARECROW]: FIELD_TOOLS,
  [SPRINKLER]: FIELD_TOOLS,
  [STONE]: MINED_RESOURCES,
  [TOOL_UPGRADE]: UPGRADES,
  [WEED]: FORAGED_ITEMS,
})

const getItemCategories = () =>
  categoryIdKeys.reduce((acc, key) => {
    acc[key] = []
    return acc
  }, {})

export const separateItemsIntoCategories = items =>
  sortItems(items).reduce((acc, item) => {
    const { type } = itemsMap[item.id]
    const category = itemTypeCategoryMap[type]

    if (category === CROPS) {
      acc[item.isPlantableCrop ? SEEDS : CROPS].push(item)
    } else if (acc[category]) {
      acc[category].push(item)
    }

    return acc
  }, getItemCategories())

export const Inventory = ({
  items,
  playerInventory,
  shopInventory,

  isPurchaseView = false,
  isSellView = false,

  itemCategories = separateItemsIntoCategories(items),
}) => (
  <div className="Inventory">
    {[
      [CROPS, 'Crops'],
      [SEEDS, 'Seeds'],
      [FORAGED_ITEMS, 'Foraged Items'],
      [FIELD_TOOLS, 'Field Tools'],
      [ANIMAL_PRODUCTS, 'Animal Products'],
      [ANIMAL_SUPPLIES, 'Animal Supplies'],
      [CRAFTED_ITEMS, 'Crafted Items'],
      [MINED_RESOURCES, 'Mined Resources'],
    ].map(([category, headerText]) =>
      itemCategories[category].length ? (
        <Fragment key={category}>
          <section>
            {isPurchaseView ? null : <h3>{headerText}</h3>}
            <ul className="card-list">
              {itemCategories[category].map(item => (
                <li key={item.id}>
                  <Item
                    {...{
                      isPurchaseView,
                      isSellView,
                      item,
                      showQuantity: isPurchaseView,
                    }}
                  />
                </li>
              ))}
            </ul>
          </section>
          {isPurchaseView ? null : <Divider />}
        </Fragment>
      ) : null
    )}
  </div>
)

Inventory.propTypes = {
  items: array.isRequired,
  playerInventory: array,
  shopInventory: array,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Inventory {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
