/** @typedef {import("../../index").farmhand.keg} keg */
import React, { useContext } from 'react'
import { object } from 'prop-types'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'

import { itemsMap } from '../../data/maps'
import { items } from '../../img'

import FarmhandContext from '../Farmhand/Farmhand.context'
import { getKegValue } from '../../utils/getKegValue'
import { moneyString } from '../../utils/moneyString'
import { getSalePriceMultiplier } from '../../utils'

import './Keg.sass'
import AnimatedNumber from '../AnimatedNumber'

/**
 * @param {Object} props
 * @param {keg} props.keg
 */
export function Keg({ keg }) {
  /**
   * @type {{
   *   handlers: {
   *     handleSellKegClick: function(keg): void
   *   },
   *   gameState: {
   *     completedAchievements: Object.<string, boolean>
   *   }
   * }}
   */
  const {
    handlers: { handleSellKegClick },
    gameState: { completedAchievements },
  } = useContext(FarmhandContext)

  const item = itemsMap[keg.itemId]
  const fermentationRecipeName = `Fermented ${item.name}`

  const handleSellRecipeClick = () => {
    handleSellKegClick(keg)
  }

  const canBeSold = keg.daysUntilMature <= 0
  const kegValue =
    getKegValue(keg) * getSalePriceMultiplier(completedAchievements)

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
              <p>Days since ready: {Math.abs(keg.daysUntilMature)}</p>
            ) : (
              <p>Days until ready: {keg.daysUntilMature}</p>
            )}
            {canBeSold ? (
              <p>
                Current value:{' '}
                <AnimatedNumber
                  {...{ number: kegValue, formatter: moneyString }}
                />
              </p>
            ) : null}
          </>
        }
      ></CardHeader>
      <CardActions>
        <Button
          {...{
            className: 'make-recipe',
            color: 'secondary',
            onClick: handleSellRecipeClick,
            variant: 'contained',
            disabled: !canBeSold,
          }}
        >
          Sell
        </Button>
        {/* FIXME: Add "Toss" button */}
      </CardActions>
    </Card>
  )
}

Keg.propTypes = {
  keg: object.isRequired,
}
