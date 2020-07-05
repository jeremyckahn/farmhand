import React from 'react'
import { array } from 'prop-types'
import memoize from 'fast-memoize'
import sortBy from 'lodash.sortby'

import FarmhandContext from '../../Farmhand.context'
import Item from '../Item'
import { itemsMap } from '../../data/maps'
import { enumify, itemType } from '../../enums'

import './Inventory.sass'

const {
  COW_FEED,
  CROP,
  DISH,
  FERTILIZER,
  MILK,
  SCARECROW,
  SPRINKLER,
} = itemType

const itemTypesToShowInReverse = new Set([itemType.MILK])

const sortItemIdsByTypeAndValue = memoize(itemIds =>
  sortBy(itemIds, [
    id => Number(itemsMap[id].type !== CROP),
    id => {
      const { type, value } = itemsMap[id]
      return itemTypesToShowInReverse.has(type) ? -value : value
    },
  ])
)

export const sort = items => {
  const itemsMap = {}
  items.forEach(item => (itemsMap[item.id] = item))

  return sortItemIdsByTypeAndValue(items.map(({ id }) => id)).map(
    id => itemsMap[id]
  )
}

export const categoryIds = enumify([
  'ANIMAL_PRODUCTS',
  'ANIMAL_SUPPLIES',
  'CROPS',
  'DISHES',
  'FIELD_TOOLS',
  'SEEDS',
])
const categoryIdKeys = Object.keys(categoryIds)
const {
  ANIMAL_PRODUCTS,
  ANIMAL_SUPPLIES,
  CROPS,
  DISHES,
  FIELD_TOOLS,
  SEEDS,
} = categoryIds

const itemTypeCategoryMap = Object.freeze({
  [COW_FEED]: ANIMAL_SUPPLIES,
  SEEDS,
  [CROP]: CROPS,
  [DISH]: DISHES,
  [FERTILIZER]: FIELD_TOOLS,
  [MILK]: ANIMAL_PRODUCTS,
  [SCARECROW]: FIELD_TOOLS,
  [SPRINKLER]: FIELD_TOOLS,
})

const getItemCategories = () =>
  categoryIdKeys.reduce((acc, key) => {
    acc[key] = []
    return acc
  }, {})

export const separateItemsIntoCategories = items =>
  sort(items).reduce((acc, item) => {
    const { type } = itemsMap[item.id]
    const category = itemTypeCategoryMap[type]

    if (category === CROPS) {
      acc[item.isPlantableCrop ? SEEDS : CROPS].push(item)
    } else {
      acc[category].push(item)
    }

    return acc
  }, getItemCategories())

export const Inventory = ({
  items,
  playerInventory,
  shopInventory,

  // Infer the type of view this is by doing an identity check against
  // gameState arrays.
  isPurchaseView = items === shopInventory,
  isSellView = items === playerInventory,

  itemCategories = separateItemsIntoCategories(items),
}) => (
  <div className="Inventory">
    {[
      [CROPS, 'Crops'],
      [SEEDS, 'Seeds'],
      [FIELD_TOOLS, 'Field Tools'],
      [ANIMAL_PRODUCTS, 'Animal Products'],
      [ANIMAL_SUPPLIES, 'Animal Supplies'],
      [DISHES, 'Dishes'],
    ].map(([category, headerText]) =>
      itemCategories[category].length ? (
        <section key={category}>
          <h3>{headerText}</h3>
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
