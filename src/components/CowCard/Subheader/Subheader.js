import React from 'react'
import { array, bool, func, object, string } from 'prop-types'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Tooltip from '@material-ui/core/Tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { faHeart as faFullHeart } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faEmptyHeart } from '@fortawesome/free-regular-svg-icons'

import { COW_COLOR_NAMES } from '../../../strings'
import { genders } from '../../../enums'
import {
  getCowWeight,
  integerString,
  isCowInBreedingPen,
  memoize,
  moneyString,
  nullArray,
} from '../../../utils'
import { huggingMachine } from '../../../data/items'
import Bloodline from '../Bloodline'

import './Subheader.sass'

// The extra 0.5 is for rounding up to the next full heart. This allows a fully
// happy cow to have full hearts on the beginning of a new day.
const isHeartFull = (heartIndex, numberOfFullHearts) =>
  heartIndex + 0.5 < numberOfFullHearts

const getCowMapById = memoize(cowInventory =>
  cowInventory.reduce((acc, cow) => {
    acc[cow.id] = cow
    return acc
  }, {})
)

const Subheader = ({
  canCowBeTradedFor,
  cow,
  cowBreedingPen,
  cowIdOfferedForTrade,
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

  const isCowOfferedForTrade = !!cowInventory.find(
    ({ id }) => id === cowIdOfferedForTrade
  )

  let canBeMovedToBreedingPen = !isBreedingPenFull && !isCowOfferedForTrade

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
    <div {...{ className: 'Subheader' }}>
      <Bloodline {...{ colorsInBloodline: cow.colorsInBloodline }} />
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
      {(isCowPurchased || canCowBeTradedFor) && (
        <p>Times traded: {integerString(cow.timesTraded)}</p>
      )}
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
    </div>
  )
}

export default Subheader

Subheader.propTypes = {
  canCowBeTradedFor: bool.isRequired,
  cow: object.isRequired,
  cowBreedingPen: object.isRequired,
  cowIdOfferedForTrade: string.isRequired,
  cowInventory: array.isRequired,
  handleCowAutomaticHugChange: func,
  handleCowBreedChange: func,
  huggingMachinesRemain: bool.isRequired,
  isCowPurchased: bool,
}
