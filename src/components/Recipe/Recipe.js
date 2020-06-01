import React from 'react'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import { array, func, object } from 'prop-types'

import { canMakeRecipe } from '../../utils'
import { itemsMap } from '../../data/maps'
import { dishes } from '../../img'

import FarmhandContext from '../../Farmhand.context'

import './Recipe.sass'

const IngredientsList = ({ recipe: { ingredients, name } }) => (
  <ul {...{ title: `Ingredients for ${name}` }}>
    {Object.keys(ingredients).map(itemId => (
      <li {...{ key: itemId }}>
        <p>
          {ingredients[itemId]} x {itemsMap[itemId].name}
        </p>
      </li>
    ))}
  </ul>
)

const Recipe = ({
  handleMakeRecipeClick,
  inventory,
  recipe,
  recipe: { id, name },
}) => (
  <Card {...{ className: 'Recipe' }}>
    <CardHeader
      {...{
        avatar: <img {...{ src: dishes[id], alt: name }} />,
        title: name,
        subheader: <IngredientsList {...{ recipe }} />,
      }}
    />
    <CardActions>
      <Button
        {...{
          className: 'make-recipe',
          color: 'primary',
          disabled: !canMakeRecipe(recipe, inventory),
          onClick: () => handleMakeRecipeClick(recipe),
          variant: 'contained',
        }}
      >
        Make
      </Button>
    </CardActions>
  </Card>
)

Recipe.propTypes = {
  handleMakeRecipeClick: func.isRequired,
  inventory: array.isRequired,
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
