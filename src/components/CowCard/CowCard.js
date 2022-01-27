import React, { memo, useEffect, useRef, useState } from 'react'
import { array, bool, func, number, object } from 'prop-types'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardHeader from '@material-ui/core/CardHeader'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import {
  faMars,
  faVenus,
  faHeart as faFullHeart,
} from '@fortawesome/free-solid-svg-icons'
import { faHeart as faEmptyHeart } from '@fortawesome/free-regular-svg-icons'

import { COW_COLOR_NAMES } from '../../strings'
import { pixel } from '../../img'
import { genders } from '../../enums'
import {
  areHuggingMachinesInInventory,
  getCowImage,
  getCowValue,
  getCowWeight,
  isCowInBreedingPen,
  isInViewport,
  memoize,
  moneyString,
  nullArray,
} from '../../utils'
import { PURCHASEABLE_COW_PENS } from '../../constants'
import { huggingMachine } from '../../data/items'

import './CowCard.sass'

const genderIcons = {
  [genders.FEMALE]: faVenus,
  [genders.MALE]: faMars,
}

// The extra 0.5 is for rounding up to the next full heart. This allows a fully
// happy cow to have full hearts on the beginning of a new day.
const isHeartFull = (heartIndex, numberOfFullHearts) =>
  heartIndex + 0.5 < numberOfFullHearts

const CowBloodline = memo(({ colorsInBloodline }) => (
  <ul {...{ className: 'bloodline' }}>
    {/* TODO: Remove the `|| {}` after 1/11/2020. */}
    {Object.keys(colorsInBloodline || {})
      .sort()
      .map(color => (
        <Tooltip
          {...{
            key: color,
            arrow: true,
            placement: 'top',
            title: COW_COLOR_NAMES[color],
          }}
        >
          <li {...{ className: color.toLowerCase() }} />
        </Tooltip>
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
      <p>Color: {COW_COLOR_NAMES[cow.color]}</p>
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
                      onChange: e =>
                        handleCowAutomaticHugChange &&
                        handleCowAutomaticHugChange(e, cow),
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
                      onChange: e =>
                        handleCowBreedChange && handleCowBreedChange(e, cow),
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

CowCardSubheader.propTypes = {
  cow: object.isRequired,
  cowBreedingPen: object.isRequired,
  cowInventory: array.isRequired,
  handleCowAutomaticHugChange: func,
  handleCowBreedChange: func,
  huggingMachinesRemain: bool.isRequired,
  isCowPurchased: bool.isRequired,
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
  const cardRef = useRef()
  const scrollAnchorRef = useRef()

  useEffect(() => {
    ;(async () => {
      setCowImage(await getCowImage(cow))
    })()
  }, [cow])

  useEffect(() => {
    if (isSelected) {
      const { current: scrollAnchor } = scrollAnchorRef
      const { current: card } = cardRef
      if (!scrollAnchor || !card) return

      // scrollIntoView is not defined in the unit test environment.
      if (scrollAnchor.scrollIntoView && !isInViewport(card)) {
        scrollAnchor.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [isSelected])

  return (
    <>
      <a
        {...{
          className: 'CowCard-scroll-anchor',
          href: `#cow-${cow.id}`,
          ref: scrollAnchorRef,
        }}
      >
        &nbsp;
      </a>
      <Card
        {...{
          className: classNames('CowCard', {
            'is-selected': isSelected,
            'is-purchased': isCowPurchased,
          }),
          raised: isSelected,
          ref: cardRef,
        }}
      >
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
                        if (debounced) {
                          setName(e.target.value)
                          debounced.handleCowNameInputChange({ ...e }, cow)
                        }
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
                  onClick: () => handleCowHugClick && handleCowHugClick(cow),
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
    </>
  )
}

CowCard.propTypes = {
  cow: object.isRequired,
  cowBreedingPen: object.isRequired,
  cowInventory: array.isRequired,
  debounced: object,
  handleCowAutomaticHugChange: func,
  handleCowBreedChange: func,
  handleCowHugClick: func,
  handleCowNameInputChange: func,
  handleCowPurchaseClick: func,
  handleCowSellClick: func,
  inventory: array.isRequired,
  isSelected: bool,
  money: number.isRequired,
  purchasedCowPen: number.isRequired,
}
