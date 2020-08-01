import React, { Fragment } from 'react'
import { array } from 'prop-types'
import Divider from '@material-ui/core/Divider'

import FarmhandContext from '../../Farmhand.context'
import Item from '../Item'
import { itemsMap } from '../../data/maps'
import { enumify, itemType } from '../../enums'
import { sortItems } from '../../utils'

import './Inventory.sass'

const {
  COW_FEED,
  CROP,
  DISH,
  FERTILIZER,
  HUGGING_MACHINE,
  MILK,
  SCARECROW,
  SPRINKLER,
} = itemType

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
  [HUGGING_MACHINE]: ANIMAL_SUPPLIES,
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
  sortItems(items).reduce((acc, item) => {
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
        <Fragment key={category}>
          <section>
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
          <Divider />
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
