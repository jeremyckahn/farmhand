import React from 'react'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import { array, bool, func, object } from 'prop-types'

import { canMakeRecipe, dollarString } from '../../utils'
import { itemsMap } from '../../data/maps'
import { dishes } from '../../img'

import FarmhandContext from '../../Farmhand.context'

import './Recipe.sass'

const noop = () => {}

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
          {playerInventoryQuantities[itemId]})
        </p>
      </li>
    ))}
  </ul>
)

const Recipe = ({
  handleMakeRecipeClick,
  inventory,
  playerInventoryQuantities,
  recipe,
  recipe: { id, name },

  canBeMade = canMakeRecipe(recipe, inventory),
}) => (
  <Card
    {...{
      className: classNames('Recipe', { 'can-be-made': canBeMade }),
      onClick: canBeMade ? () => handleMakeRecipeClick(recipe) : noop,
    }}
  >
    <CardHeader
      {...{
        avatar: <img {...{ src: dishes[id], alt: name }} />,
        title: name,
        subheader: (
          <>
            <p>Sell price: {dollarString(itemsMap[id].value)}</p>
            <p>In Inventory: {playerInventoryQuantities[id]}</p>
            <IngredientsList {...{ playerInventoryQuantities, recipe }} />
          </>
        ),
      }}
    />
    <CardActions>
      <Button
        {...{
          // The onClick handler for this is bound on the parent Card for
          // better click-ability.
          className: 'make-recipe',
          color: 'primary',
          disabled: !canBeMade,
          variant: 'contained',
        }}
      >
        Make
      </Button>
    </CardActions>
  </Card>
)

Recipe.propTypes = {
  canBeMade: bool,
  handleMakeRecipeClick: func.isRequired,
  inventory: array.isRequired,
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
