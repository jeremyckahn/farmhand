import React, { memo, useEffect, useState } from 'react'
import { array, func, number, object, string } from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardHeader from '@material-ui/core/CardHeader'
import Checkbox from '@material-ui/core/Checkbox'
import Fab from '@material-ui/core/Fab'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import sortBy from 'lodash.sortby'
import classNames from 'classnames'
import {
  faMars,
  faVenus,
  faHeart as faFullHeart,
} from '@fortawesome/free-solid-svg-icons'
import { faHeart as faEmptyHeart } from '@fortawesome/free-regular-svg-icons'

import Item from '../Item'
import { pixel } from '../../img'
import FarmhandContext from '../../Farmhand.context'
import { enumify, genders } from '../../enums'
import {
  areHuggingMachinesInInventory,
  getCowImage,
  getCowValue,
  getCowSellValue,
  getCowWeight,
  findCowById,
  memoize,
  moneyString,
  nullArray,
} from '../../utils'
import { PURCHASEABLE_COW_PENS } from '../../constants'
import { cowFeed, huggingMachine } from '../../data/items'

import { TabPanel, a11yProps } from './TabPanel'

import './CowPenContextMenu.sass'

const genderIcons = {
  [genders.FEMALE]: faVenus,
  [genders.MALE]: faMars,
}

// The extra 0.5 is for rounding up to the next full heart. This allows a fully
// happy cow to have full hearts on the beginning of a new day.
const isHeartFull = (heartIndex, numberOfFullHearts) =>
  heartIndex + 0.5 < numberOfFullHearts

const isCowInBreedingPen = (cow, cowBreedingPen) =>
  cowBreedingPen.cowId1 === cow.id || cowBreedingPen.cowId2 === cow.id

const CowBloodline = memo(({ colorsInBloodline }) => (
  <ul {...{ className: 'bloodline' }}>
    {/* TODO: Remove the `|| {}` after 1/11/2020. */}
    {Object.keys(colorsInBloodline || {})
      .sort()
      .map(color => (
        <li {...{ key: color, className: color.toLowerCase() }} />
      ))}
  </ul>
))

const getCowMapById = memoize(cowInventory =>
  cowInventory.reduce((acc, cow) => {
    acc[cow.id] = cow
    return acc
  }, {})
)

export const CowCardSubheader = ({
  cow,
  cowBreedingPen,
  cowInventory,
  cowValue,
  handleCowAutomaticHugChange,
  handleCowBreedChange,
  huggingMachinesRemain,
  isCowPurchased,
}) => {
  const numberOfFullHearts = cow.happiness * 10
  const isInBreedingPen = isCowInBreedingPen(cow, cowBreedingPen)
  const isBreedingPenFull =
    cowBreedingPen.cowId1 !== null && cowBreedingPen.cowId2 !== null

  let canBeMovedToBreedingPen = !isBreedingPenFull

  if (canBeMovedToBreedingPen) {
    const potentialMateId = cowBreedingPen.cowId2 ?? cowBreedingPen.cowId1

    if (potentialMateId !== null) {
      canBeMovedToBreedingPen =
        cow.gender !== getCowMapById(cowInventory)[potentialMateId].gender
    }
  }

  const disableBreedingControlTooltip =
    !canBeMovedToBreedingPen && !isInBreedingPen

  return (
    <>
      <CowBloodline {...{ colorsInBloodline: cow.colorsInBloodline }} />
      {isCowPurchased && (
        <p>
          {cow.daysOld} {cow.daysOld === 1 ? 'day' : 'days'} old
        </p>
      )}
      <p>
        {isCowPurchased ? 'Value' : 'Price'}: {moneyString(cowValue)}
      </p>
      <p>Weight: {getCowWeight(cow)} lbs.</p>
      {isCowPurchased && (
        <>
          <ol className="hearts">
            {nullArray(10).map((_null, i) => (
              <li key={`${cow.id}_${i}`}>
                <FontAwesomeIcon
                  {...{
                    icon: isHeartFull(i, numberOfFullHearts)
                      ? faFullHeart
                      : faEmptyHeart,
                    className: classNames('heart', {
                      'is-full': isHeartFull(i, numberOfFullHearts),
                    }),
                  }}
                />
              </li>
            ))}
          </ol>
          <Tooltip
            {...{
              arrow: true,
              placement: 'top',
              title: `Check this box to put ${cow.name} into a ${huggingMachine.name} and automatically hug them at the start of every day. Requires a Hugging Machine in your inventory.`,
            }}
          >
            <FormControlLabel
              {...{
                control: (
                  <Checkbox
                    {...{
                      color: 'primary',
                      checked: cow.isUsingHuggingMachine,
                      onChange: e => handleCowAutomaticHugChange(e, cow),
                    }}
                  />
                ),
                disabled: !cow.isUsingHuggingMachine && !huggingMachinesRemain,
                label: 'Hug automatically',
              }}
            />
          </Tooltip>
          <Tooltip
            {...{
              arrow: true,
              placement: 'top',
              disableFocusListener: disableBreedingControlTooltip,
              disableHoverListener: disableBreedingControlTooltip,
              disableTouchListener: disableBreedingControlTooltip,
              title: isInBreedingPen
                ? `Uncheck this box to return ${cow.name} to the regular pen.`
                : `Check this box to move ${
                    cow.name
                  } to the breeding pen to mate with a ${
                    cow.gender === genders.MALE ? 'female' : 'male'
                  } cow.`,
            }}
          >
            <FormControlLabel
              {...{
                control: (
                  <Checkbox
                    {...{
                      color: 'primary',
                      checked: isInBreedingPen,
                      onChange: e => handleCowBreedChange(e, cow),
                    }}
                  />
                ),
                disabled: isInBreedingPen ? false : !canBeMovedToBreedingPen,
                label: 'Breed',
              }}
            />
          </Tooltip>
        </>
      )}
    </>
  )
}

export const CowCard = ({
  cow,
  cowBreedingPen,
  cowInventory,
  debounced,
  handleCowAutomaticHugChange,
  handleCowBreedChange,
  handleCowHugClick,
  handleCowNameInputChange,
  handleCowPurchaseClick,
  handleCowSellClick,
  inventory,
  isSelected,
  money,
  purchasedCowPen,

  isCowPurchased = !!handleCowSellClick,
  cowValue = getCowValue(cow, isCowPurchased),
  huggingMachinesRemain = areHuggingMachinesInInventory(inventory),
  isNameEditable = !!handleCowNameInputChange,
}) => {
  const [name, setName] = useState(cow.name)
  const [cowImage, setCowImage] = useState(pixel)

  useEffect(() => {
    ;(async () => {
      setCowImage(await getCowImage(cow))
    })()
  }, [cow])

  return (
    <Card {...{ className: 'cow-card', raised: isSelected }}>
      {isSelected && (
        <span className="visually_hidden">
          {cow.name} is currently selected
        </span>
      )}
      <CardHeader
        {...{
          avatar: <img {...{ src: cowImage }} alt="Cow" />,
          title: (
            <>
              {isNameEditable ? (
                <TextField
                  {...{
                    onChange: e => {
                      setName(e.target.value)
                      debounced.handleCowNameInputChange({ ...e }, cow)
                    },
                    placeholder: 'Name',
                    value: name,
                  }}
                />
              ) : (
                cow.name
              )}{' '}
              <FontAwesomeIcon
                {...{
                  icon: genderIcons[cow.gender],
                }}
              />
            </>
          ),
          subheader: (
            <CowCardSubheader
              {...{
                cow,
                cowBreedingPen,
                cowInventory,
                cowValue,
                handleCowBreedChange,
                handleCowAutomaticHugChange,
                huggingMachinesRemain,
                isCowPurchased,
              }}
            />
          ),
        }}
      />
      <CardActions>
        {!isCowPurchased && (
          <Button
            {...{
              className: 'purchase',
              color: 'primary',
              disabled:
                cowValue > money ||
                cowInventory.length >=
                  PURCHASEABLE_COW_PENS.get(purchasedCowPen).cows,
              onClick: () => handleCowPurchaseClick(cow),
              variant: 'contained',
            }}
          >
            Buy
          </Button>
        )}
        {isCowPurchased && (
          <>
            <Button
              {...{
                className: 'hug',
                color: 'primary',
                onClick: () => handleCowHugClick(cow),
                variant: 'contained',
              }}
            >
              Hug
            </Button>
            <Button
              {...{
                className: 'sell',
                color: 'secondary',
                onClick: () => handleCowSellClick(cow),
                variant: 'contained',
              }}
            >
              Sell
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  )
}

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
  debounced,
  handleCowAutomaticHugChange,
  handleCowBreedChange,
  handleCowHugClick,
  handleCowNameInputChange,
  handleCowPurchaseClick,
  handleCowSelect,
  handleCowSellClick,
  inventory,
  money,
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
          cowBreedingPen,
          cowInventory,
          handleCowPurchaseClick,
          inventory,
          money,
          purchasedCowPen,
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
                    cowBreedingPen,
                    cowInventory,
                    debounced,
                    handleCowAutomaticHugChange,
                    handleCowBreedChange,
                    handleCowHugClick,
                    handleCowNameInputChange,
                    handleCowSellClick,
                    inventory,
                    isSelected: cow.id === selectedCowId,
                    money,
                    purchasedCowPen,
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
                    cowBreedingPen,
                    cowInventory,
                    debounced,
                    handleCowAutomaticHugChange,
                    handleCowBreedChange,
                    handleCowHugClick,
                    handleCowNameInputChange,
                    handleCowSellClick,
                    inventory,
                    isSelected: cow.id === selectedCowId,
                    money,
                    purchasedCowPen,
                  }}
                />
              </li>
            )
          })}
        </ul>
      </TabPanel>
      <TabPanel value={currentTab} index={2}>
        <ul className="card-list">
          <li>
            <Item
              {...{
                item: cowFeed,
                isPurchaseView: true,
                showQuantity: true,
              }}
            />
          </li>
          <li>
            <Item
              {...{
                item: huggingMachine,
                isPurchaseView: true,
                showQuantity: true,
              }}
            />
          </li>
        </ul>
      </TabPanel>
    </div>
  )
}

CowPenContextMenu.propTypes = {
  cowForSale: object.isRequired,
  cowInventory: array.isRequired,
  debounced: object.isRequired,
  handleCowAutomaticHugChange: func.isRequired,
  handleCowBreedChange: func.isRequired,
  handleCowHugClick: func.isRequired,
  handleCowNameInputChange: func.isRequired,
  handleCowPurchaseClick: func.isRequired,
  handleCowSelect: func.isRequired,
  handleCowSellClick: func.isRequired,
  inventory: array.isRequired,
  money: number.isRequired,
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
