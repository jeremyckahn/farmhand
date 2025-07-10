import React, { Fragment, useState } from 'react'
import Accordion from '@mui/material/Accordion/index.js'
import AccordionSummary from '@mui/material/AccordionSummary/index.js'
import AccordionDetails from '@mui/material/AccordionDetails/index.js'
import Checkbox from '@mui/material/Checkbox/index.js'
import FormControlLabel from '@mui/material/FormControlLabel/index.js'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore.js'
import { array } from 'prop-types'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import Item from '../Item/index.js'
import { itemsMap } from '../../data/maps.js'
import { sortItems } from '../../utils/index.js'
import SearchBar from '../SearchBar/index.js'
import './Inventory.sass'

// Using Map for categories to preserve key order and enable Map methods
export const categoryIds = new Map([
  ['CROPS', 'CROPS'],
  ['SEEDS', 'SEEDS'],
  ['FORAGED_ITEMS', 'FORAGED_ITEMS'],
  ['FIELD_TOOLS', 'FIELD_TOOLS'],
  ['ANIMAL_PRODUCTS', 'ANIMAL_PRODUCTS'],
  ['ANIMAL_SUPPLIES', 'ANIMAL_SUPPLIES'],
  ['CRAFTED_ITEMS', 'CRAFTED_ITEMS'],
  ['MINED_RESOURCES', 'MINED_RESOURCES'],
])

const itemTypeCategoryMap = new Map([
  ['SEEDS', 'SEEDS'],
  ['COW_FEED', 'ANIMAL_SUPPLIES'],
  ['CRAFTED_ITEM', 'CRAFTED_ITEMS'],
  ['CROP', 'CROPS'],
  ['FERTILIZER', 'FIELD_TOOLS'],
  ['FUEL', 'MINED_RESOURCES'],
  ['HUGGING_MACHINE', 'ANIMAL_SUPPLIES'],
  ['MILK', 'ANIMAL_PRODUCTS'],
  ['ORE', 'MINED_RESOURCES'],
  ['SCARECROW', 'FIELD_TOOLS'],
  ['SPRINKLER', 'FIELD_TOOLS'],
  ['STONE', 'MINED_RESOURCES'],
  ['WEED', 'FORAGED_ITEMS'],
])

// Initialize Map to group items into categories
const getItemCategories = () =>
  new Map(Array.from(categoryIds.keys()).map(key => [key, []]))

export const separateItemsIntoCategories = (
  /** @type {farmhand.item[]} */ items
) =>
  sortItems(items).reduce(
    /**
     * @param {Map<string, farmhand.item[]>} categories
     * @param {farmhand.item} item
     */
    (categories, item) => {
      const { type } = itemsMap[item.id]
      const category = itemTypeCategoryMap.get(type)

      if (category === 'CROPS') {
        const targetCategory = item.isPlantableCrop ? 'SEEDS' : 'CROPS'
        categories.get(targetCategory)?.push(item)
      } else if (category != null && categories.has(category)) {
        categories.get(category)?.push(item)
      }

      return categories
    },
    getItemCategories()
  )

const formatCategoryName = key =>
  key
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase())

const Inventory = ({
  /** @type {farmhand.item[]} */ items,
  playerInventory,
  shopInventory,
  isPurchaseView = false,
  isSellView = false,
  itemCategories = separateItemsIntoCategories(items),
  placeholder = 'Search inventory...',
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState(
    /** @type {string[]} */ ([])
  )
  const toggleCategory = category => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const filteredCategories = Array.from(itemCategories.entries()).reduce(
    (filtered, [category, items]) => {
      const matchingItems = items.filter(item => {
        const mappedItem = itemsMap[item.id]
        return (
          mappedItem &&
          mappedItem.name &&
          mappedItem.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })

      if (
        matchingItems.length &&
        (!selectedCategories.length || selectedCategories.includes(category))
      ) {
        filtered.set(category, matchingItems)
      }
      return filtered
    },
    new Map()
  )

  return (
    <div className="Inventory">
      <SearchBar placeholder={placeholder} onSearch={setSearchQuery} />
      {!isPurchaseView && (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="filter-content"
            id="filter-header"
          >
            <h4>Filter by category</h4>
          </AccordionSummary>
          <AccordionDetails>
            <div className="filter-section">
              {Array.from(categoryIds.keys()).map(key => (
                <FormControlLabel
                  key={key}
                  sx={{
                    display: 'block',
                  }}
                  control={
                    <Checkbox
                      disabled={isPurchaseView}
                      checked={selectedCategories.includes(key)}
                      onChange={() => toggleCategory(key)}
                    />
                  }
                  label={formatCategoryName(key)}
                />
              ))}
            </div>
          </AccordionDetails>
        </Accordion>
      )}
      {Array.from(filteredCategories.entries()).map(([category, items]) =>
        items.length ? (
          <Fragment key={category}>
            <section>
              <h3>{formatCategoryName(category)}</h3>
              <ul className="card-list">
                {items.map(item => (
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
