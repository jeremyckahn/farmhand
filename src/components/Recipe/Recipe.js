import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import Button from '@mui/material/Button/index.js'
import Card from '@mui/material/Card/index.js'
import CardHeader from '@mui/material/CardHeader/index.js'
import CardContent from '@mui/material/CardContent/index.js'
import CardActions from '@mui/material/CardActions/index.js'
import Typography from '@mui/material/Typography/index.js'
import { array, func, number, object } from 'prop-types'

import { totalIngredientsInRecipe } from '../../utils/totalIngredientsInRecipe.js'
import {
  canMakeRecipe,
  doesInventorySpaceRemain,
  dollarString,
  maxYieldOfRecipe,
  integerString,
} from '../../utils/index.js'
import { itemsMap } from '../../data/maps.js'
import { craftedItems } from '../../img/index.js'
import QuantityInput from '../QuantityInput/index.js'
import IngredientsList from '../IngredientsList/index.js'

import FarmhandContext from '../Farmhand/Farmhand.context.js'

import './Recipe.sass'
import { INFINITE_STORAGE_LIMIT } from '../../constants.js'

const Recipe = ({
  handleMakeRecipeClick,
  inventory,
  inventoryLimit,
  playerInventoryQuantities,
  recipe,
  recipe: { id, name, description },
}) => {
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    setQuantity(
      Math.min(maxYieldOfRecipe(recipe, inventory), Math.max(1, quantity))
    )
  }, [inventory, recipe, quantity])

  // Fixes https://github.com/jeremyckahn/farmhand/issues/25
  const spaceFreedByIngredientsConsumed =
    quantity * totalIngredientsInRecipe(recipe)

  const canBeMade =
    quantity > 0 &&
    canMakeRecipe(recipe, inventory, quantity) &&
    doesInventorySpaceRemain({
      inventory,
      // Without the Infinity coercion, this would break recipes for unlimited
      // inventoryLimits.
      inventoryLimit:
        (inventoryLimit === INFINITE_STORAGE_LIMIT
          ? Infinity
          : inventoryLimit) + spaceFreedByIngredientsConsumed,
    })

  const handleMakeRecipe = () => {
    if (canBeMade) {
      handleMakeRecipeClick(recipe, quantity)
    }
  }

  const maxQuantity = maxYieldOfRecipe(recipe, inventory)

  return (
    <Card
      {...{
        className: classNames('Recipe', { 'can-be-made': canBeMade }),
      }}
    >
      <CardHeader
        {...{
          avatar: <img {...{ src: craftedItems[id], alt: name }} />,
          title: name,
          subheader: (
            <>
              <p>Sell price: {dollarString(itemsMap[id].value)}</p>
              <p>
                In Inventory: {integerString(playerInventoryQuantities[id])}
              </p>
              <IngredientsList {...{ playerInventoryQuantities, recipe }} />
            </>
          ),
        }}
      />
      {description && (
        <CardContent>
          <Typography>{description}</Typography>
        </CardContent>
      )}
      <CardActions>
        <Button
          {...{
            className: 'make-recipe',
            color: 'primary',
            disabled: !canBeMade || !quantity,
            onClick: handleMakeRecipe,
            variant: 'contained',
          }}
        >
          Make
        </Button>
        <QuantityInput
          {...{
            handleSubmit: handleMakeRecipe,
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

Recipe.propTypes = {
  handleMakeRecipeClick: func.isRequired,
  inventory: array.isRequired,
  inventoryLimit: number.isRequired,
  playerInventoryQuantities: object.isRequired,
  recipe: object.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Recipe {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
