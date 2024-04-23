import React, { useContext } from 'react'
import { oneOf } from 'prop-types'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'

import {
  grapeVarietyNameMap,
  grapeVarietyVarietyGrapeMap,
} from '../../data/crops/grape'
import { wineService } from '../../services/wine'
import { grapeVariety } from '../../enums'
import { wines } from '../../img'
import { integerString } from '../../utils'
import { getInventoryQuantityMap } from '../../utils/getInventoryQuantityMap'
import FarmhandContext from '../Farmhand/Farmhand.context'

/**
 * @param {{
 *   wineVariety: grapeVariety
 * }} props
 */
export const WineRecipe = ({ wineVariety }) => {
  const {
    gameState: { inventory },
  } = useContext(FarmhandContext)
  const wineName = grapeVarietyNameMap[wineVariety]
  const grape = grapeVarietyVarietyGrapeMap[wineVariety]

  const inventoryQuantityMap = getInventoryQuantityMap(inventory)

  return (
    <Card className="WineRecipe">
      <CardHeader
        title={wineName}
        avatar={
          <img
            {...{
              src: wines[wineVariety],
            }}
            alt={wineName}
          />
        }
        subheader={
          <>
            <p>
              Days to mature:{' '}
              {integerString(wineService.getDaysToMature(wineVariety))}
            </p>
            <p>
              Required:{' '}
              {integerString(wineService.getGrapesRequiredForWine(wineVariety))}{' '}
              x {grape.name} (available:{' '}
              {integerString(inventoryQuantityMap[grape.id])})
            </p>
            {
              // FIXME: Show amount in cellar
            }
          </>
        }
      ></CardHeader>
      <CardActions>
        <Button color="primary" variant="contained">
          Make
        </Button>
      </CardActions>
    </Card>
  )
}

WineRecipe.propTypes = {
  wineVariety: oneOf(Object.keys(grapeVariety)),
}
