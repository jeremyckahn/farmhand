import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import { array, func, number, object } from 'prop-types'

import {
  canMakeRecipe,
  doesInventorySpaceRemain,
  dollarString,
  maxYieldOfRecipe,
  integerString,
} from '../../utils'
import { itemsMap } from '../../data/maps'
import { craftedItems } from '../../img'
import QuantityInput from '../QuantityInput'
import AnimatedNumber from '../AnimatedNumber'

import FarmhandContext from '../../Farmhand.context'

import './Recipe.sass'

const IngredientsList = ({
  playerInventoryQuantities,
  recipe: { ingredients, name },
}) => (
  <ul {...{ className: 'card-list', title: `Ingredients for ${name}` }}>
    <li>
      <h4>Ingredients required:</h4>
    </li>
    {Object.keys(ingredients).map(itemId => (
      <li {...{ key: itemId }}>
        <p
          {...{
            className: classNames(
              playerInventoryQuantities[itemId] >= ingredients[itemId]
                ? 'in-stock'
                : 'out-of-stock'
            ),
          }}
        >
          {ingredients[itemId]} x {itemsMap[itemId].name} (On hand:{' '}
          <AnimatedNumber
            {...{
              number: playerInventoryQuantities[itemId],
              formatter: integerString,
            }}
          />
          )
        </p>
      </li>
    ))}
  </ul>
)

const Recipe = ({
  handleMakeRecipeClick,
  inventory,
  inventoryLimit,
  playerInventoryQuantities,
  recipe,
  recipe: { id, name },
}) => {
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    setQuantity(Math.min(maxYieldOfRecipe(recipe, inventory), 1))
  }, [inventory, recipe])

  // Fixes https://github.com/jeremyckahn/farmhand/issues/25
  const spaceFreedByIngredientsConsumed =
    quantity *
    Object.values(recipe.ingredients).reduce(
      (acc, quantity) => acc + quantity,
      0
    )

  const canBeMade =
    quantity > 0 &&
    canMakeRecipe(recipe, inventory, quantity) &&
    doesInventorySpaceRemain({
      inventory,
      // Without the Infinity coercion, this would break recipes for unlimited
      // inventoryLimits.
      inventoryLimit:
        (inventoryLimit === -1 ? Infinity : inventoryLimit) +
        spaceFreedByIngredientsConsumed,
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
      <CardActions>
        <Button
          {...{
            className: 'make-recipe',
            color: 'primary',
            disabled: !canBeMade,
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
