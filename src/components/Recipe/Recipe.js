import React, { useState } from 'react'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import { array, bool, func, number, object } from 'prop-types'

import {
  canMakeRecipe,
  doesInventorySpaceRemain,
  dollarString,
  maxYieldOfRecipe,
  integerString,
} from '../../utils'
import { itemsMap } from '../../data/maps'
import { dishes } from '../../img'
import QuantityInput from '../QuantityInput'

import FarmhandContext from '../../Farmhand.context'

import './Recipe.sass'

const IngredientsList = ({
  playerInventoryQuantities,
  recipe: { ingredients, name },
}) => (
  <ul {...{ className: 'card-list', title: `Ingredients for ${name}` }}>
    <li>
      <h3>Ingredients required:</h3>
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
          {integerString(playerInventoryQuantities[itemId])})
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

  canBeMade = canMakeRecipe(recipe, inventory) &&
    doesInventorySpaceRemain({ inventory, inventoryLimit }),
}) => {
  const handleMakeRecipe = () => {
    if (canBeMade) {
      // FIXME: Pass quantity here.
      handleMakeRecipeClick(recipe)

      // FIXME: Update quantity with setQuantity here.
    }
  }

  const [quantity, setQuantity] = useState(1)

  return (
    <Card
      {...{
        className: classNames('Recipe', { 'can-be-made': canBeMade }),
      }}
    >
      <CardHeader
        {...{
          avatar: <img {...{ src: dishes[id], alt: name }} />,
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
            maxQuantity: maxYieldOfRecipe(recipe, inventory),
            setQuantity: setQuantity,
            value: quantity,
          }}
        />
      </CardActions>
    </Card>
  )
}

Recipe.propTypes = {
  canBeMade: bool,
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
