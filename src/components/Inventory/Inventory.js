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
import SearchBar from '../SearchBar/index.js'
import './Inventory.sass'

// Using Map to preserve the key order
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

const orderedCategoryIdKeys = Array.from(categoryIds.keys())

const itemTypeCategoryMap = {
  SEEDS: categoryIds.get('SEEDS'),
  COW_FEED: categoryIds.get('ANIMAL_SUPPLIES'),
  CRAFTED_ITEM: categoryIds.get('CRAFTED_ITEMS'),
  CROP: categoryIds.get('CROPS'),
  FERTILIZER: categoryIds.get('FIELD_TOOLS'),
  FUEL: categoryIds.get('MINED_RESOURCES'),
  HUGGING_MACHINE: categoryIds.get('ANIMAL_SUPPLIES'),
  MILK: categoryIds.get('ANIMAL_PRODUCTS'),
  ORE: categoryIds.get('MINED_RESOURCES'),
  SCARECROW: categoryIds.get('FIELD_TOOLS'),
  SPRINKLER: categoryIds.get('FIELD_TOOLS'),
  STONE: categoryIds.get('MINED_RESOURCES'),
  WEED: categoryIds.get('FORAGED_ITEMS'),
}

const separateItemsIntoCategories = items =>
  items.reduce(
    (acc, item) => {
      const { type } = itemsMap[item.id] || {}
      const category = itemTypeCategoryMap[type]

      if (category) {
        acc[category] = acc[category] || []
        acc[category].push(item)
      }
      return acc
    },
    Array.from(categoryIds.keys()).reduce(
      (acc, key) => ({ ...acc, [key]: [] }),
      {}
    )
  )

const formatCategoryName = key =>
  key
    .replace('_', ' ')
    .toLowerCase()
    .replace(/(?:^|\s)\S/g, match => match.toUpperCase())

const Inventory = ({
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
              {orderedCategoryIdKeys.map(key => (
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
      {orderedCategoryIdKeys.map(category =>
        filteredCategories[category]?.length ? (
          <Fragment key={category}>
            <section>
              <h3>{formatCategoryName(category)}</h3>
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
