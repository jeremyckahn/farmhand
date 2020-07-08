import React, { useState } from 'react'
import { array, func, number, object, string } from 'prop-types'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import TextField from '@material-ui/core/TextField'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import {
  faMars,
  faVenus,
  faHeart as faFullHeart,
} from '@fortawesome/free-solid-svg-icons'
import { faHeart as faEmptyHeart } from '@fortawesome/free-regular-svg-icons'

import Item from '../Item'
import { animals } from '../../img'
import FarmhandContext from '../../Farmhand.context'
import { cowColors, genders } from '../../enums'
import { moneyString, getCowValue, getCowWeight } from '../../utils'
import { PURCHASEABLE_COW_PENS } from '../../constants'
import { cowFeed } from '../../data/items'

import './CowPenContextMenu.sass'

const genderIcons = {
  [genders.FEMALE]: faVenus,
  [genders.MALE]: faMars,
}

const nullHeartList = new Array(10).fill(null)

// The extra 0.5 is for rounding up to the next full heart. This allows a fully
// happy cow to have full hearts on the beginning of a new day.
const isHeartFull = (heartIndex, numberOfFullHearts) =>
  heartIndex + 0.5 < numberOfFullHearts

export const CowCardSubheader = ({
  cow,
  cowValue,
  isCowPurchased,

  numberOfFullHearts = cow.happiness * 10,
}) => (
  <>
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
      <ol className="hearts">
        {nullHeartList.map((_null, i) => (
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
    )}
  </>
)

export const CowCard = ({
  cow,
  cowInventory,
  debounced,
  handleCowHugClick,
  handleCowNameInputChange,
  handleCowPurchaseClick,
  handleCowSellClick,
  isSelected,
  money,
  purchasedCowPen,

  cowValue = getCowValue(cow),
  isCowPurchased = !!handleCowSellClick,
  isNameEditable = !!handleCowNameInputChange,
}) => {
  const [name, setName] = useState(cow.name)

  return (
    <Card {...{ raised: isSelected }}>
      <CardHeader
        {...{
          avatar: (
            <img
              {...{ src: animals.cow[cowColors[cow.color].toLowerCase()] }}
              alt="Cow"
            />
          ),
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
                cowValue,
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

export const CowPenContextMenu = ({
  cowForSale,
  cowInventory,
  debounced,
  handleCowHugClick,
  handleCowNameInputChange,
  handleCowPurchaseClick,
  handleCowSelect,
  handleCowSellClick,
  money,
  purchasedCowPen,
  selectedCowId,
}) => (
  <div className="CowPenContextMenu">
    <h3>Supplies</h3>
    <Item
      {...{
        item: cowFeed,
        isPurchaseView: true,
        showQuantity: true,
      }}
    />
    <h3>For sale</h3>
    <CowCard
      {...{
        cow: cowForSale,
        cowInventory,
        handleCowPurchaseClick,
        money,
        purchasedCowPen,
      }}
    />
    <h3>
      Cows ({cowInventory.length} /{' '}
      {PURCHASEABLE_COW_PENS.get(purchasedCowPen).cows})
    </h3>
    <ul className="card-list purchased-cows">
      {cowInventory.map(cow => (
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
              cowInventory,
              debounced,
              handleCowHugClick,
              handleCowNameInputChange,
              handleCowSellClick,
              isSelected: cow.id === selectedCowId,
              money,
              purchasedCowPen,
            }}
          />
        </li>
      ))}
    </ul>
  </div>
)

CowPenContextMenu.propTypes = {
  cowForSale: object.isRequired,
  cowInventory: array.isRequired,
  debounced: object.isRequired,
  handleCowHugClick: func.isRequired,
  handleCowNameInputChange: func.isRequired,
  handleCowPurchaseClick: func.isRequired,
  handleCowSelect: func.isRequired,
  handleCowSellClick: func.isRequired,
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
