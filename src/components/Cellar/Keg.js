/** @typedef {import("../../index").farmhand.keg} keg */
import React, { useContext } from 'react'
import { object } from 'prop-types'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'

import { itemsMap } from '../../data/maps'
import { items } from '../../img'

import FarmhandContext from '../Farmhand/Farmhand.context'
import { getKegValue } from '../../utils/getKegValue'
import { moneyString } from '../../utils/moneyString'
import { getSalePriceMultiplier } from '../../utils'
import { FERMENTED_CROP_NAME } from '../../templates'
import AnimatedNumber from '../AnimatedNumber'

import './Keg.sass'
import { getKegSpoilageRate } from '../../utils/getKegSpoilageRate'

/**
 * @param {Object} props
 * @param {keg} props.keg
 */
export function Keg({ keg }) {
  /**
   * @type {{
   *   handlers: {
   *     handleSellKegClick: function(keg): void,
   *     handleThrowAwayKegClick: function(keg): void
   *   },
   *   gameState: {
   *     completedAchievements: Object.<string, boolean>
   *   }
   * }}
   */
  const {
    handlers: { handleSellKegClick, handleThrowAwayKegClick },
    gameState: { completedAchievements },
  } = useContext(FarmhandContext)

  const item = itemsMap[keg.itemId]
  const fermentationRecipeName = FERMENTED_CROP_NAME`${item}`

  const handleSellClick = () => {
    handleSellKegClick(keg)
  }

  const handleThrowAwayClick = () => {
    handleThrowAwayKegClick(keg)
  }

  const canBeSold = keg.daysUntilMature <= 0
  const kegValue =
    getKegValue(keg) * getSalePriceMultiplier(completedAchievements)

  const spoilageRate = getKegSpoilageRate(keg)
  const spoilageRateDisplayValue = Number((spoilageRate * 100).toPrecision(2))

  return (
    <Card className="Keg">
      <CardHeader
        title={fermentationRecipeName}
        avatar={
          <img
            {...{
              src: items[item.id],
            }}
            alt={fermentationRecipeName}
          />
        }
        subheader={
          <>
            {canBeSold ? (
              <>
                <p>Days since ready: {Math.abs(keg.daysUntilMature)}</p>
                <p>
                  Current value:{' '}
                  <AnimatedNumber
                    {...{ number: kegValue, formatter: moneyString }}
                  />
                </p>
                <p>Potential for spoilage: {spoilageRateDisplayValue}%</p>
              </>
            ) : (
              <p>Days until ready: {keg.daysUntilMature}</p>
            )}
          </>
        }
      ></CardHeader>
      <CardActions>
        <Button
          {...{
            className: 'sell-keg',
            color: 'error',
            onClick: handleSellClick,
            variant: 'contained',
            disabled: !canBeSold,
          }}
        >
          Sell
        </Button>
        {!canBeSold ? (
          <Button
            {...{
              className: 'throw-away-keg',
              color: 'error',
              onClick: handleThrowAwayClick,
              variant: 'contained',
            }}
          >
            Throw away
          </Button>
        ) : null}
      </CardActions>
    </Card>
  )
}

Keg.propTypes = {
  keg: object.isRequired,
}
