import React, { Fragment, useState } from 'react'
import { array } from 'prop-types'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import Item from '../Item/index.js'
import { itemsMap } from '../../data/maps.js'
import { enumify, itemType } from '../../enums.js'
import { sortItems } from '../../utils/index.js'
import SearchBar from '../SearchBar/index.js'
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
  placeholder = 'Search inventory...',
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [filterVisible, setFilterVisible] = useState(false)
  const toggleCategory = category => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const filteredCategories = Object.keys(itemCategories).reduce(
    (filtered, category) => {
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(category)
      ) {
        return filtered
      }
      filtered[category] = itemCategories[category]?.filter(item =>
        itemsMap[item.id]?.name
          ?.toLowerCase()
          ?.includes(searchQuery.toLowerCase())
      )
      return filtered
    },
    {}
  )

  return (
    <div className="Inventory">
      <SearchBar
        placeholder={placeholder || 'Search inventory...'}
        onSearch={setSearchQuery}
      />
      {!isPurchaseView && (
        <>
          <div
            className="filter-toggle"
            onClick={() => setFilterVisible(!filterVisible)}
          >
            {filterVisible ? '▼ Hide Filters' : '▲ Show Filters'}
          </div>
          <div
            className={`filter-container ${
              filterVisible ? 'visible' : 'hidden'
            }`}
          >
            <div className="filter-section">
              <h4>Filter by category:</h4>
              {categoryIdKeys.map(key => (
                <label key={key} className="filter-checkbox">
                  <input
                    type="checkbox"
                    disabled={isPurchaseView}
                    checked={selectedCategories.includes(key)}
                    onChange={() => toggleCategory(key)}
                  />
                  {key
                    .replace('_', ' ')
                    .toLowerCase()
                    .replace(/(?:^|\s)\S/g, match => match.toUpperCase())}
                </label>
              ))}
            </div>
          </div>
        </>
      )}
      {categoryIdKeys.map(category =>
        filteredCategories[category]?.length ? (
          <Fragment key={category}>
            <section>
              <h3>
                {category
                  .replace('_', ' ')
                  .toLowerCase()
                  .replace(/(?:^|\s)\S/g, match => match.toUpperCase())}
              </h3>
              <ul className="card-list">
                {filteredCategories[category].map(item => (
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
          </Fragment>
        ) : null
      )}
    </div>
  )
}

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
