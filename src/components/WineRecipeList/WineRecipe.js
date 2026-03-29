import React, { useContext, useEffect, useState } from 'react'
import { oneOf } from 'prop-types'
import Card from '@mui/material/Card/index.js'
import CardHeader from '@mui/material/CardHeader/index.js'
import CardActions from '@mui/material/CardActions/index.js'
import Button from '@mui/material/Button/index.js'

import {
  grapeVarietyNameMap,
  grapeVarietyToGrapeItemMap,
} from '../../data/crops/grape.js'
import { itemsMap } from '../../data/maps.js'
import { wineService } from '../../services/wine.js'
import { grapeVariety } from '../../enums.js'
import { wines } from '../../img/index.js'
import { integerString } from '../../utils/index.js'
import { getInventoryQuantityMap } from '../../utils/getInventoryQuantityMap.js'
import { getYeastRequiredForWine } from '../../utils/getYeastRequiredForWine.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'
import {
  GRAPES_REQUIRED_FOR_WINE,
  PURCHASEABLE_CELLARS,
} from '../../constants.js'
import { cellarService } from '../../services/cellar.js'
import QuantityInput from '../QuantityInput/index.js'
import { yeast } from '../../data/recipes.js'

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
  const grape = grapeVarietyToGrapeItemMap[wineVariety]
  const wine = itemsMap[grape.wineId]
  const { space: cellarSize } = PURCHASEABLE_CELLARS.get(purchasedCellar) ?? {
    space: 0,
  }

  const inventoryQuantityMap = getInventoryQuantityMap(inventory)
  const quantityOfGrape = inventoryQuantityMap[grape.id] ?? 0
  const quantityOfYeast = inventoryQuantityMap[yeast.id] ?? 0

  useEffect(() => {
    setQuantity(
      Math.min(
        wineService.getMaxWineYield({
          grape,
          inventory,
          cellarInventory,
          cellarSize,
        }),
        Math.max(1, quantity)
      )
    )
  }, [cellarInventory, cellarSize, grape, inventory, quantity, wineVariety])

  const canBeMade =
    quantity > 0 &&
    quantityOfGrape >= GRAPES_REQUIRED_FOR_WINE &&
    cellarService.doesCellarSpaceRemain(cellarInventory, purchasedCellar)

  const disableMakeButton = !canBeMade || !quantity

  const wineInstancesInCellar = cellarService.getItemInstancesInCellar(
    cellarInventory,
    wine
  )

  const maxQuantity = wineService.getMaxWineYield({
    grape,
    inventory,
    cellarInventory,
    cellarSize,
  })

  const handleMakeWine = () => {
    if (canBeMade) {
      handleMakeWineClick(grape, quantity)
    }
  }

  return (
    <Card className="WineRecipe" sx={{ position: 'relative' }}>
      <CardHeader
        title={wineName}
        avatar={<img src={wines[wineVariety]} alt={wineName} />}
        subheader={
          <>
            <p>
              Days to mature: {/* @ts-expect-error */}
              {integerString(wineService.getDaysToMature(wineVariety))}
            </p>
            <p>
              Units of {grape.name} required:{' '}
              {integerString(GRAPES_REQUIRED_FOR_WINE)} (available:{' '}
              {integerString(quantityOfGrape)})
            </p>
            <p>
              Units of {yeast.name} required:{' '}
              {integerString(getYeastRequiredForWine(wineVariety) * quantity)}{' '}
              (available: {integerString(quantityOfYeast)})
            </p>
            <p>In cellar: {integerString(wineInstancesInCellar ?? 0)}</p>
          </>
        }
      ></CardHeader>
      <CardActions>
        <Button
          color="primary"
          variant="contained"
          disabled={disableMakeButton}
          onClick={handleMakeWine}
        >
          Make
        </Button>
        <QuantityInput
          handleSubmit={handleMakeWine}
          handleUpdateNumber={setQuantity}
          maxQuantity={maxQuantity}
          setQuantity={setQuantity}
          value={quantity}
        />
      </CardActions>
    </Card>
  )
}

WineRecipe.propTypes = {
  wineVariety: oneOf(Object.keys(grapeVariety)),
}
