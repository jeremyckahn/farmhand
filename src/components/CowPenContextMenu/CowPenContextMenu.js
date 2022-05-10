import React, { useState } from 'react'
import { array, func, number, object, string } from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import Fab from '@material-ui/core/Fab'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import sortBy from 'lodash.sortby'

import Item from '../Item'
import FarmhandContext from '../../Farmhand.context'
import { enumify } from '../../enums'
import {
  findCowById,
  getCowSellValue,
  getCowWeight,
  isCowInBreedingPen,
  nullArray,
} from '../../utils'
import { PURCHASEABLE_COW_PENS } from '../../constants'
import cowShopInventory from '../../data/shop-inventory-cow'

import CowCard from '../CowCard'

import { TabPanel, a11yProps } from './TabPanel'

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

  return (
    <div className="CowPenContextMenu">
      <h3>For sale</h3>
      <CowCard
        {...{
          cow: cowForSale,
        }}
      />
      <AppBar position="static" color="primary">
        <Tabs
          value={currentTab}
          onChange={(e, newTab) => setCurrentTab(newTab)}
          aria-label="Cow tabs"
        >
          <Tab {...{ label: 'Cows', ...a11yProps(0) }} />
          <Tab {...{ label: 'Breeding Pen', ...a11yProps(1) }} />
          <Tab {...{ label: 'Supplies', ...a11yProps(2) }} />
        </Tabs>
      </AppBar>
      <TabPanel value={currentTab} index={0}>
        <h3>
          Capacity: {cowInventory.length} /{' '}
          {PURCHASEABLE_COW_PENS.get(purchasedCowPen).cows}
        </h3>
        {cowInventory.length > 1 && (
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
              {...{
                className: 'sort-select',
                displayEmpty: true,
                value: sortType,
                onChange: ({ target: { value } }) => setSortType(value),
              }}
            >
              <MenuItem {...{ value: VALUE }}>Sort by Value</MenuItem>
              <MenuItem {...{ value: AGE }}>Sort by Age</MenuItem>
              <MenuItem {...{ value: HAPPINESS }}>Sort by Happiness</MenuItem>
              <MenuItem {...{ value: WEIGHT }}>Sort by Weight</MenuItem>
              <MenuItem {...{ value: GENDER }}>Sort by Gender</MenuItem>
              <MenuItem {...{ value: COLOR }}>Sort by Color</MenuItem>
            </Select>
          </div>
        )}

        <ul className="card-list purchased-cows">
          {sortCows(cowInventory, sortType, isAscending).map(cow =>
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
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <h3>Capacity: {numberOfCowsBreeding(cowBreedingPen)} / 2</h3>
        <ul className="card-list purchased-cows breeding-cows">
          {nullArray(numberOfCowsBreeding(cowBreedingPen)).map((_null, i) => {
            const cowId = cowBreedingPen[`cowId${i + 1}`]
            const cow = findCowById(cowInventory, cowId)
            return (
              <li {...{ key: cowId }}>
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
          })}
        </ul>
      </TabPanel>
      <TabPanel value={currentTab} index={2}>
        <ul className="card-list">
          {cowShopInventory.map((item, i) => (
            <li key={i}>
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
