import React, { useContext, useEffect, useState } from 'react'
import { oneOf } from 'prop-types'
import Card from '@mui/material/Card/index.js'
import CardHeader from '@mui/material/CardHeader/index.js'
import CardActions from '@mui/material/CardActions/index.js'
import Button from '@mui/material/Button/index.js'

import {
  grapeVarietyNameMap,
  grapeVarietyToGrapeItemMap,
} from '../../data/crops/grape.ts'
import { itemsMap } from '../../data/maps.ts'
import { wineService } from '../../services/wine.ts'
import { grapeVariety } from '../../enums.ts'
import { wines } from '../../img/index.ts'
import { integerString } from '../../utils/index.tsx'
import { getInventoryQuantityMap } from '../../utils/getInventoryQuantityMap.ts'
import { getYeastRequiredForWine } from '../../utils/getYeastRequiredForWine.ts'
import FarmhandContext from '../Farmhand/Farmhand.context.tsx'
import {
  GRAPES_REQUIRED_FOR_WINE,
  PURCHASEABLE_CELLARS,
} from '../../constants.ts'
import { cellarService } from '../../services/cellar.ts'
import QuantityInput from '../QuantityInput/index.ts'
import { yeast } from '../../data/recipes.ts'

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
  // @ts-expect-error
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
              Days to mature:{' '}
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
