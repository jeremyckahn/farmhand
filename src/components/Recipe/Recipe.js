import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import { array, func, number, object } from 'prop-types'

import {
  canMakeRecipe,
  doesInventorySpaceRemain,
  dollarString,
  maxYieldOfRecipe,
  integerString,
  totalIngredientsInRecipe,
} from '../../utils'
import { itemsMap } from '../../data/maps'
import { craftedItems } from '../../img'
import QuantityInput from '../QuantityInput'
import IngredientsList from '../IngredientsList'

import FarmhandContext from '../Farmhand/Farmhand.context'

import './Recipe.sass'
import { INFINITE_STORAGE_LIMIT } from '../../constants'

const Recipe = ({
  handleMakeRecipeClick,
  inventory,
  inventoryLimit,
  playerInventoryQuantities,
  recipe,
  recipe: { playerId, name, description },
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
          avatar: <img {...{ src: craftedItems[playerId], alt: name }} />,
          title: name,
          subheader: (
            <>
              <p>Sell price: {dollarString(itemsMap[playerId].value)}</p>
              <p>
                In Inventory: {integerString(playerInventoryQuantities[playerId])}
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
