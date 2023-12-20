/** @typedef {import('../../../components/Farmhand/Farmhand').farmhand.state} farmhand.state */
/** @typedef {import('../../../index').farmhand.cow} farmhand.cow */
/** @typedef {import('../CowCard').CowCardProps} CowCardProps */
import React from 'react'
import { array, bool, func, object, string } from 'prop-types'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { faHeart as faFullHeart } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faEmptyHeart } from '@fortawesome/free-regular-svg-icons'

import { COW_COLOR_NAMES } from '../../../strings'
import { genders } from '../../../enums'
import { moneyString } from '../../../utils/moneyString'
import {
  getCowWeight,
  getPlayerName,
  integerString,
  isCowInBreedingPen,
  nullArray,
} from '../../../utils'
import { memoize } from '../../../utils/memoize'
import { huggingMachine } from '../../../data/items'
import Bloodline from '../Bloodline'

import './Subheader.sass'

// The extra 0.5 is for rounding up to the next full heart. This allows a fully
// happy cow to have full hearts on the beginning of a new day.
/**
 * @param {number} heartIndex
 * @param {number} numberOfFullHearts
 */
const isHeartFull = (heartIndex, numberOfFullHearts) =>
  heartIndex + 0.5 < numberOfFullHearts

const getCowMapById = memoize(
  /**
   * @param {farmhand.state['cowInventory']} cowInventory
   */
  cowInventory =>
    cowInventory.reduce((acc, cow) => {
      acc[cow.id] = cow
      return acc
    }, {})
)

/**
 * @typedef {Pick<
 *    CowCardProps,
 *    'cow' |
 *    'cowBreedingPen' |
 *    'cowIdOfferedForTrade' |
 *    'cowInventory' |
 *    'handleCowAutomaticHugChange' |
 *    'handleCowBreedChange' |
 *    'huggingMachinesRemain' |
 *    'id'
 *  > & {
 *    canCowBeTradedFor: boolean,
 *    cowValue: number,
 *    isCowPurchased: boolean,
 *  }} SubheaderProps
 */

const Subheader = (
  /** @type {SubheaderProps} */
  {
    canCowBeTradedFor,
    cow,
    cowBreedingPen,
    cowIdOfferedForTrade,
    cowInventory,
    cowValue,
    handleCowAutomaticHugChange,
    handleCowBreedChange,
    huggingMachinesRemain,
    id: playerId,
    isCowPurchased,
  }
) => {
  const numberOfFullHearts = cow.happiness * 10
  const isInBreedingPen = isCowInBreedingPen(cow, cowBreedingPen)
  const isRoomInBreedingPen =
    cowBreedingPen.cowId1 === null || cowBreedingPen.cowId2 === null
  const isThisCowOfferedForTrade = cowIdOfferedForTrade === cow.id

  const mateId = cowBreedingPen.cowId1 ?? cowBreedingPen.cowId2
  const mate = getCowMapById(cowInventory)[mateId ?? '']
  const isEligibleToBreed = cow.gender !== mate?.gender

  const canBeMovedToBreedingPen =
    isRoomInBreedingPen && isEligibleToBreed && !isThisCowOfferedForTrade

  const disableBreedingControlTooltip =
    !canBeMovedToBreedingPen && !isInBreedingPen

  const showOriginalOwner =
    isCowPurchased &&
    playerId !== cow.originalOwnerId &&
    playerId === cow.ownerId

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
        {/* cow.originalOwnerId is only an empty string when it is for sale. */}
        {cow.originalOwnerId === '' ? 'Price' : 'Value'}:{' '}
        {moneyString(cowValue)}
      </p>
      <p>Weight: {getCowWeight(cow)} lbs.</p>
      {(isCowPurchased || canCowBeTradedFor) && (
        <p>Times traded: {integerString(cow.timesTraded)}</p>
      )}
      {showOriginalOwner && (
        <p>
          Original owner: <strong>{getPlayerName(cow.originalOwnerId)}</strong>
        </p>
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
              title: (
                <Typography>
                  Check this box to put {cow.name} into a {huggingMachine.name}
                  and automatically hug them at the start of every day. Requires
                  a Hugging Machine in your inventory.
                </Typography>
              ),
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
              title: (
                <Typography>
                  {isInBreedingPen
                    ? `Uncheck this box to return ${cow.name} to the regular pen.`
                    : `Check this box to move ${
                        cow.name
                      } to the breeding pen to mate with a ${
                        cow.gender === genders.MALE ? 'female' : 'male'
                      } cow.`}
                </Typography>
              ),
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
  id: string.isRequired,
  isCowPurchased: bool,
}
