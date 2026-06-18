import React, { useState } from 'react'
import PropTypes from 'prop-types'

import SearchBar from '../SearchBar/index.js'
import Recipe from '../Recipe/index.js'

export function RecipeList({
  allRecipes,
  learnedRecipes,
}: {
  allRecipes: Record<string, farmhand.recipe>
  learnedRecipes: string[]
}) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRecipes = searchQuery
    ? learnedRecipes.filter((recipeId: string) =>
        allRecipes[recipeId]?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : learnedRecipes

  const numLearnedRecipes = filteredRecipes.length
  const totalRecipes = Object.keys(allRecipes).length

  return (
    <>
      <h3>
        Learned Recipes ({numLearnedRecipes} / {totalRecipes})
      </h3>
      {learnedRecipes.length > 0 && (
        <SearchBar placeholder="Search recipes..." onSearch={setSearchQuery} />
      )}
      {filteredRecipes.length > 0 && (
        <ul className="card-list">
          {filteredRecipes.map((recipeId: string) => (
            <li key={recipeId}>
              <Recipe
                {...{
                  recipe: allRecipes[recipeId],
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

RecipeList.propTypes = {
  allRecipes: PropTypes.object.isRequired,
  learnedRecipes: PropTypes.array.isRequired,
}
