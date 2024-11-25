/** @typedef {import("../../index").farmhand.keg} keg */
import React, { useContext, useState } from 'react'
import { number } from 'prop-types'
import Divider from '@mui/material/Divider/index.js'
import Card from '@mui/material/Card/index.js'
import CardContent from '@mui/material/CardContent/index.js'
import ReactMarkdown from 'react-markdown'

import SearchBar from '../SearchBar/index.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'
import {
  KEG_INTEREST_RATE,
  PURCHASEABLE_CELLARS,
  WINE_GROWTH_TIMELINE_CAP,
  WINE_INTEREST_RATE,
} from '../../constants.js'

import { integerString } from '../../utils/index.js'
import { itemsMap } from '../../data/maps.js'
import { FERMENTED_CROP_NAME } from '../../templates.js'

import { TabPanel } from './TabPanel/index.js'
import { Keg } from './Keg.js'

/**
 * @param {Object} props
 * @param {number} props.index
 * @param {number} props.currentTab
 */
export const CellarInventoryTabPanel = ({ index, currentTab }) => {
  const [searchQuery, setSearchQuery] = useState('')

  /**
   * @type {{
   *   gameState: {
   *     cellarInventory:Array.<keg>,
   *     purchasedCellar: number
   *   }
   * }}
   */
  const {
    gameState: { cellarInventory, purchasedCellar },
  } = useContext(FarmhandContext)

  const searchTerms = searchQuery
    .toLowerCase()
    .split(' ')
    .filter(term => term.length > 0)

  const filteredKegs = cellarInventory.filter(keg => {
    const item = itemsMap[keg.itemId]
    const itemName = item.name.toLowerCase()
    const fermentationRecipeName = `${FERMENTED_CROP_NAME}${item.name}`.toLowerCase()

    return searchTerms.every(
      term => fermentationRecipeName.includes(term) || itemName.includes(term)
    )
  })

  return (
    <TabPanel value={currentTab} index={index}>
      <h3>
        Capacity: {integerString(filteredKegs.length)} /{' '}
        {integerString(PURCHASEABLE_CELLARS.get(purchasedCellar).space)}
      </h3>
      {cellarInventory.length > 0 && (
        <SearchBar placeholder="Search kegs..." onSearch={setSearchQuery} />
      )}
      <ul className="card-list">
        {filteredKegs.map(keg => (
          <li key={keg.id}>
            <Keg keg={keg} />
          </li>
        ))}
      </ul>
      <Divider />
      <ul className="card-list">
        <li>
          <Card>
            <CardContent>
              <ReactMarkdown
                {...{
                  linkTarget: '_blank',
                  className: 'markdown',
                  source: `This is your inventory of Cellar kegs.

Keg contents take time to reach maturity before they can be sold. After they reach maturity, keg contents become higher in quality over time and their value grows.

Kegs that contain fermented crops compound in value at a rate of ${KEG_INTEREST_RATE}% a day but have an increasing chance of spoiling.

Kegs that contain wine compound in value at a rate of ${WINE_INTEREST_RATE}% for up to ${integerString(
                    WINE_GROWTH_TIMELINE_CAP
                  )} days and never spoil.`,
                }}
              />
            </CardContent>
          </Card>
        </li>
      </ul>
    </TabPanel>
  )
}

CellarInventoryTabPanel.propTypes = {
  currentTab: number.isRequired,
  index: number.isRequired,
}
