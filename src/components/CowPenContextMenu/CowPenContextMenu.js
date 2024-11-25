import React, { useState, useEffect } from 'react'
import { array, func, number, object, string } from 'prop-types'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward.js'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward.js'
import Fab from '@mui/material/Fab/index.js'
import MenuItem from '@mui/material/MenuItem/index.js'
import Select from '@mui/material/Select/index.js'
import Tab from '@mui/material/Tab/index.js'
import Tabs from '@mui/material/Tabs/index.js'
import sortBy from 'lodash.sortby'

import Item from '../Item/index.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'
import { enumify } from '../../enums.js'
import {
  findCowById,
  getCowSellValue,
  getCowWeight,
  isCowInBreedingPen,
  nullArray,
} from '../../utils/index.js'
import { PURCHASEABLE_COW_PENS } from '../../constants.js'
import cowShopInventory from '../../data/shop-inventory-cow.js'

import CowCard from '../CowCard/index.js'
import SearchBar from '../SearchBar/index.js'

import { TabPanel, a11yProps } from './TabPanel/index.js'
import './CowPenContextMenu.sass'

const { AGE, COLOR, GENDER, HAPPINESS, VALUE, WEIGHT } = enumify([
  'AGE',
  'COLOR',
  'GENDER',
  'HAPPINESS',
  'VALUE',
  'WEIGHT',
])

const sortCows = (cows, sortType, isAscending) => {
  let sorter = _ => _

  if (sortType === VALUE) {
    sorter = getCowSellValue
  } else if (sortType === WEIGHT) {
    sorter = getCowWeight
  } else if (sortType === AGE) {
    sorter = ({ daysOld }) => daysOld
  } else if (sortType === COLOR) {
    sorter = ({ color }) => color
  } else if (sortType === GENDER) {
    sorter = ({ gender }) => gender
  } else if (sortType === HAPPINESS) {
    sorter = ({ happiness }) => happiness
  }

  const sortedCows = sortBy(cows, sorter)

  return isAscending ? sortedCows.reverse() : sortedCows
}

/*!
 * @param {farmhand.cowBreedingPen} cowBreedingPen
 * @returns {number}
 */
const numberOfCowsBreeding = ({ cowId1, cowId2 }) =>
  cowId1 ? (cowId2 ? 2 : 1) : 0

export const CowPenContextMenu = ({
  cowBreedingPen,
  cowForSale,
  cowInventory,
  handleCowAutomaticHugChange,
  handleCowBreedChange,
  handleCowHugClick,
  handleCowNameInputChange,
  handleCowOfferClick,
  handleCowSelect,
  handleCowSellClick,
  handleCowWithdrawClick,
  purchasedCowPen,
  selectedCowId,
}) => {
  const [sortType, setSortType] = useState(AGE)
  const [isAscending, setIsAscending] = useState(false)
  const [currentTab, setCurrentTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setSearchQuery('')
  }, [currentTab])

  const filteredCowInventory = searchQuery
    ? cowInventory.filter(cow =>
        cow.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : cowInventory

  const filteredShopInventory = searchQuery
    ? cowShopInventory.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : cowShopInventory

  return (
    <div className="CowPenContextMenu">
      <h3>For sale</h3>
      <CowCard
        {...{
          cow: cowForSale,
        }}
      />
      <Tabs
        value={currentTab}
        onChange={(_e, newTab) => setCurrentTab(newTab)}
        aria-label="Cow tabs"
        sx={{ mt: '1rem' }}
      >
        <Tab {...{ label: 'Cows', ...a11yProps(0) }} />
        <Tab {...{ label: 'Breeding Pen', ...a11yProps(1) }} />
        <Tab {...{ label: 'Supplies', ...a11yProps(2) }} />
      </Tabs>
      <TabPanel value={currentTab} index={0}>
        <h3>
          Capacity: {cowInventory.length} /{' '}
          {PURCHASEABLE_COW_PENS.get(purchasedCowPen).cows}
        </h3>

        {cowInventory.length > 0 && (
          <SearchBar
            placeholder="Search cows by name..."
            onSearch={setSearchQuery}
          />
        )}

        {filteredCowInventory.length > 0 && (
          <>
            {filteredCowInventory.length > 1 && (
              <div {...{ className: 'sort-wrapper' }}>
                <Fab
                  {...{
                    'aria-label': 'Toggle sorting order',
                    onClick: () => setIsAscending(!isAscending),
                    color: 'primary',
                  }}
                >
                  {isAscending ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                </Fab>
                <Select
                  variant="standard"
                  {...{
                    className: 'sort-select',
                    displayEmpty: true,
                    value: sortType,
                    onChange: ({ target: { value } }) => setSortType(value),
                  }}
                >
                  <MenuItem {...{ value: VALUE }}>Sort by Value</MenuItem>
                  <MenuItem {...{ value: AGE }}>Sort by Age</MenuItem>
                  <MenuItem {...{ value: HAPPINESS }}>
                    Sort by Happiness
                  </MenuItem>
                  <MenuItem {...{ value: WEIGHT }}>Sort by Weight</MenuItem>
                  <MenuItem {...{ value: GENDER }}>Sort by Gender</MenuItem>
                  <MenuItem {...{ value: COLOR }}>Sort by Color</MenuItem>
                </Select>
              </div>
            )}

            <ul className="card-list purchased-cows">
              {sortCows(filteredCowInventory, sortType, isAscending).map(cow =>
                isCowInBreedingPen(cow, cowBreedingPen) ? null : (
                  <li
                    {...{
                      key: cow.id,
                      onFocus: () => handleCowSelect(cow),
                      onClick: () => handleCowSelect(cow),
                    }}
                  >
                    <CowCard
                      {...{
                        cow,
                        handleCowAutomaticHugChange,
                        handleCowBreedChange,
                        handleCowHugClick,
                        handleCowNameInputChange,
                        handleCowOfferClick,
                        handleCowSellClick,
                        handleCowWithdrawClick,
                        isCowPurchased: true,
                        isSelected: cow.id === selectedCowId,
                      }}
                    />
                  </li>
                )
              )}
            </ul>
          </>
        )}
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        {(() => {
          const filteredCows = nullArray(numberOfCowsBreeding(cowBreedingPen))
            .map((_null, i) => {
              const cowId = cowBreedingPen[`cowId${i + 1}`]
              const cow = findCowById(cowInventory, cowId)

              if (
                !cow ||
                !cow.name.toLowerCase().includes(searchQuery.toLowerCase())
              ) {
                return null
              }

              return cow
            })
            .filter(Boolean)

          return (
            <>
              <h3>Capacity: {numberOfCowsBreeding(cowBreedingPen)} / 2</h3>
              {cowInventory.length > 0 && (
                <SearchBar
                  placeholder="Search cows by name..."
                  onSearch={setSearchQuery}
                />
              )}
              <ul className="card-list purchased-cows breeding-cows">
                {filteredCows.map(cow => (
                  <li key={cow.id}>
                    <CowCard
                      {...{
                        cow,
                        handleCowAutomaticHugChange,
                        handleCowBreedChange,
                        handleCowHugClick,
                        handleCowNameInputChange,
                        handleCowOfferClick,
                        handleCowSellClick,
                        handleCowWithdrawClick,
                        isCowPurchased: true,
                        isSelected: cow.id === selectedCowId,
                      }}
                    />
                  </li>
                ))}
              </ul>
            </>
          )
        })()}
      </TabPanel>
      <TabPanel value={currentTab} index={2}>
        {cowShopInventory.length > 0 && (
          <SearchBar
            placeholder="Search supplies..."
            onSearch={setSearchQuery}
          />
        )}
        <ul className="card-list">
          {filteredShopInventory.map(item => (
            <li key={item.id}>
              <Item
                {...{
                  item,
                  isPurchaseView: true,
                  showQuantity: true,
                }}
              />
            </li>
          ))}
        </ul>
      </TabPanel>
    </div>
  )
}

CowPenContextMenu.propTypes = {
  cowForSale: object.isRequired,
  cowInventory: array.isRequired,
  handleCowAutomaticHugChange: func.isRequired,
  handleCowBreedChange: func.isRequired,
  handleCowHugClick: func.isRequired,
  handleCowNameInputChange: func.isRequired,
  handleCowOfferClick: func.isRequired,
  handleCowSelect: func.isRequired,
  handleCowSellClick: func.isRequired,
  handleCowWithdrawClick: func.isRequired,
  purchasedCowPen: number.isRequired,
  selectedCowId: string.isRequired,
}

export default function Consumer() {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <CowPenContextMenu {...{ ...gameState, ...handlers }} />
      )}
    </FarmhandContext.Consumer>
  )
}
