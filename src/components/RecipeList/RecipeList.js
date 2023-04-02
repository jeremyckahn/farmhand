import React from 'react'
import PropTypes from 'prop-types'

import Recipe from '../Recipe'

export function RecipeList({ allRecipes, learnedRecipes }) {
  const numLearnedRecipes = learnedRecipes.length
  const totalRecipes = Object.keys(allRecipes).length

  return (
    <>
      <h3>
        Learned Recipes ({numLearnedRecipes} / {totalRecipes})
      </h3>
      <ul className="card-list">
        {learnedRecipes.map(recipeId => (
          <li key={recipeId}>
            <Recipe
              {...{
                recipe: allRecipes[recipeId],
              }}
            />
          </li>
        ))}
      </ul>
    </>
  )
}

RecipeList.propTypes = {
  allRecipes: PropTypes.object.isRequired,
  learnedRecipes: PropTypes.array.isRequired,
}
