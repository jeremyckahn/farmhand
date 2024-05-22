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
import { itemsMap } from '../../data/maps'
import { wineService } from '../../services/wine'
import { grapeVariety } from '../../enums'
import { wines } from '../../img'
import { integerString } from '../../utils'
import { getInventoryQuantityMap } from '../../utils/getInventoryQuantityMap'
import { getYeastRequiredForWine } from '../../utils/getYeastRequiredForWine'
import FarmhandContext from '../Farmhand/Farmhand.context'
import { GRAPES_REQUIRED_FOR_WINE, PURCHASEABLE_CELLARS } from '../../constants'
import { cellarService } from '../../services/cellar'
import QuantityInput from '../QuantityInput'
import { yeast } from '../../data/recipes'

/**
 * @typedef {{
 *   wineVariety: grapeVariety
 * }} WineRecipeProps
 */

/**
 * @param {WineRecipeProps} props
 */
export const WineRecipe = ({ wineVariety }) => {
  const {
    gameState: { cellarInventory, inventory, purchasedCellar },
    handlers: { handleMakeWineClick },
  } = useContext(FarmhandContext)

  const [quantity, setQuantity] = useState(1)
  const wineName = grapeVarietyNameMap[wineVariety]
  const grape = grapeVarietyVarietyGrapeMap[wineVariety]
  const wine = itemsMap[grape.wineId]
  const { space: cellarSize } = PURCHASEABLE_CELLARS.get(purchasedCellar) ?? {
    space: 0,
  }

  const inventoryQuantityMap = getInventoryQuantityMap(inventory)

  useEffect(() => {
    setQuantity(
      Math.min(
        wineService.getMaxWineYield(
          grape,
          inventory,
          cellarInventory,
          cellarSize
        ),
        Math.max(1, quantity)
      )
    )
  }, [cellarInventory, cellarSize, grape, inventory, quantity, wineVariety])

  const canBeMade =
    quantity > 0 &&
    cellarService.doesCellarSpaceRemain(cellarInventory, purchasedCellar)

  const wineInstancesInCellar = cellarService.getItemInstancesInCellar(
    cellarInventory,
    wine
  )

  const maxQuantity = wineService.getMaxWineYield(
    grape,
    inventory,
    cellarInventory,
    cellarSize
  )

  const handleMakeWine = () => {
    if (canBeMade) {
      handleMakeWineClick(grape, quantity)
    }
  }

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
              Units of {grape.name} required:{' '}
              {integerString(GRAPES_REQUIRED_FOR_WINE)} (available:{' '}
              {integerString(inventoryQuantityMap[grape.id] ?? 0)})
            </p>
            <p>
              Units of {yeast.name} required:{' '}
              {integerString(getYeastRequiredForWine(wineVariety))} (available:{' '}
              {integerString(inventoryQuantityMap[yeast.id] ?? 0)})
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
          onClick={handleMakeWine}
        >
          Make
        </Button>
        <QuantityInput
          {...{
            handleSubmit: handleMakeWine,
            handleUpdateNumber: setQuantity,
            maxQuantity,
            setQuantity,
            value: quantity,
          }}
        />
      </CardActions>
    </Card>
  )
}

WineRecipe.propTypes = {
  wineVariety: oneOf(Object.keys(grapeVariety)),
}
