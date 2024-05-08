import React, { useContext, useEffect, useState } from 'react'
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
import { GRAPES_REQUIRED_FOR_WINE, PURCHASEABLE_CELLARS } from '../../constants'
import { cellarService } from '../../services/cellar'
import { doesCellarSpaceRemain } from '../../utils/doesCellarSpaceRemain'

/**
 * @param {{
 *   wineVariety: grapeVariety
 * }} props
 */
export const WineRecipe = ({ wineVariety }) => {
  const {
    gameState: { cellarInventory, inventory, purchasedCellar },
  } = useContext(FarmhandContext)
  const [quantity, setQuantity] = useState(1)
  const wineName = grapeVarietyNameMap[wineVariety]
  const grape = grapeVarietyVarietyGrapeMap[wineVariety]
  const { space: cellarSize } = PURCHASEABLE_CELLARS.get(purchasedCellar) ?? {
    space: 0,
  }

  const inventoryQuantityMap = getInventoryQuantityMap(inventory)

  useEffect(() => {
    setQuantity(
      Math.min(
        cellarService.getMaxWineYield(
          grape,
          inventory,
          cellarInventory,
          cellarSize,
          wineVariety
        ),
        Math.max(1, quantity)
      )
    )
  }, [cellarInventory, cellarSize, grape, inventory, quantity, wineVariety])

  const canBeMade =
    quantity > 0 && doesCellarSpaceRemain(cellarInventory, purchasedCellar)

  const wineInstancesInCellar = cellarService.getItemInstancesInCellar(
    cellarInventory,
    grape
  )

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
            {
              // FIXME: Test this
            }
            <p>
              Days to mature:{' '}
              {integerString(wineService.getDaysToMature(wineVariety))}
            </p>
            {
              // FIXME: Test this
            }
            <p>
              Units of {grape.name} required:{' '}
              {integerString(GRAPES_REQUIRED_FOR_WINE)} (available:{' '}
              {integerString(inventoryQuantityMap[grape.id])})
            </p>
            {
              // FIXME: Test this
            }
            <p>
              Units of {'yeast'} required:{' '}
              {integerString(wineService.getYeastRequiredForWine(wineVariety))}
            </p>
            {
              // FIXME: Test this
            }
            <p>In cellar: {integerString(wineInstancesInCellar ?? 0)}</p>
          </>
        }
      ></CardHeader>
      <CardActions>
        <Button
          color="primary"
          variant="contained"
          // FIXME: Test this
          disabled={!canBeMade || !quantity}
        >
          Make
        </Button>
      </CardActions>
    </Card>
  )
}

WineRecipe.propTypes = {
  wineVariety: oneOf(Object.keys(grapeVariety)),
}
