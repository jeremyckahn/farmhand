import React, { useContext, useEffect, useState } from 'react'
import { object } from 'prop-types'
import Card from '@mui/material/Card/index.js'
import CardHeader from '@mui/material/CardHeader/index.js'
import CardActions from '@mui/material/CardActions/index.js'
import Button from '@mui/material/Button/index.js'

import { itemsMap } from '../../data/maps.js'
import { items } from '../../img/index.js'
import { vinegarService } from '../../services/vinegar.js'
import { integerString } from '../../utils/integerString.js'
import { getInventoryQuantityMap } from '../../utils/getInventoryQuantityMap.js'
import { maxYieldOfRecipe } from '../../utils/maxYieldOfRecipe.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'
import { PURCHASEABLE_CELLARS } from '../../constants.js'
import { cellarService } from '../../services/cellar.js'
import QuantityInput from '../QuantityInput/index.js'

export const VinegarRecipe = ({ recipe }: { recipe: farmhand.vinegar }) => {
  const {
    gameState: { cellarInventory, inventory, purchasedCellar },
    handlers: { handleMakeVinegarClick },
  } = useContext(FarmhandContext)

  const [quantity, setQuantity] = useState(1)

  const { space: cellarSize } = PURCHASEABLE_CELLARS.get(purchasedCellar) ?? {
    space: 0,
  }

  const inventoryQuantityMap = getInventoryQuantityMap(inventory)

  const maxQuantity = vinegarService.getMaxVinegarYield({
    recipe,
    inventory,
    cellarInventory,
    cellarSize,
  })

  useEffect(() => {
    setQuantity(Math.min(maxQuantity, Math.max(1, quantity)))
  }, [cellarInventory, cellarSize, inventory, maxQuantity, quantity, recipe])

  const canBeMade =
    quantity > 0 &&
    maxYieldOfRecipe(recipe, inventory) > 0 &&
    cellarService.doesCellarSpaceRemain(cellarInventory, purchasedCellar)

  const disableMakeButton = !canBeMade || !quantity

  const vinegarInstancesInCellar = cellarService.getItemInstancesInCellar(
    cellarInventory,
    recipe
  )

  const handleMakeVinegar = () => {
    if (canBeMade) {
      handleMakeVinegarClick(recipe, quantity)
    }
  }

  return (
    <Card className="VinegarRecipe" sx={{ position: 'relative' }}>
      <CardHeader
        title={recipe.name}
        avatar={
          <img src={items[recipe.id as keyof typeof items]} alt={recipe.name} />
        }
        subheader={
          <>
            <p>Days to mature: {integerString(recipe.daysToMature)}</p>
            {Object.keys(recipe.ingredients).map(ingredientId => {
              const ingredientItem = itemsMap[ingredientId]
              const quantityRequired =
                recipe.ingredients[ingredientId] * quantity
              const quantityAvailable = inventoryQuantityMap[ingredientId] ?? 0

              return (
                <p key={ingredientId}>
                  Units of {ingredientItem.name} required:{' '}
                  {integerString(quantityRequired)} (available:{' '}
                  {integerString(quantityAvailable)})
                </p>
              )
            })}
            <p>In cellar: {integerString(vinegarInstancesInCellar ?? 0)}</p>
          </>
        }
      ></CardHeader>
      <CardActions>
        <Button
          color="primary"
          variant="contained"
          disabled={disableMakeButton}
          onClick={handleMakeVinegar}
        >
          Make
        </Button>
        <QuantityInput
          handleSubmit={handleMakeVinegar}
          handleUpdateNumber={setQuantity}
          maxQuantity={maxQuantity}
          setQuantity={setQuantity}
          value={quantity}
        />
      </CardActions>
    </Card>
  )
}

VinegarRecipe.propTypes = {
  recipe: object.isRequired,
}
