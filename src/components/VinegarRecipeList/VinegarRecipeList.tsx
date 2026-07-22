import React, { useState, useContext } from 'react'

import SearchBar from '../SearchBar/index.js'
import { getVinegarRecipesAvailableToMake } from '../../utils/getVinegarRecipesAvailableToMake.js'
import { recipeCategories } from '../../data/maps.js'
import { recipeType } from '../../enums.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'

import { VinegarRecipe } from './VinegarRecipe.js'

const totalVinegarRecipes = Object.keys(recipeCategories[recipeType.VINEGAR])
  .length

export const VinegarRecipeList = () => {
  const {
    gameState: { itemsSold },
  } = useContext(FarmhandContext)

  const vinegarRecipesAvailableToMake = getVinegarRecipesAvailableToMake(
    itemsSold
  )

  const [searchQuery, setSearchQuery] = useState('')

  const filteredVinegarRecipes = vinegarRecipesAvailableToMake.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <h3>
        Available Vinegar Recipes ({filteredVinegarRecipes.length} /{' '}
        {totalVinegarRecipes})
      </h3>

      {vinegarRecipesAvailableToMake.length > 0 && (
        <SearchBar
          placeholder="Search vinegar recipes..."
          onSearch={setSearchQuery}
        />
      )}

      <ul className="card-list">
        {filteredVinegarRecipes.map(recipe => (
          <li key={recipe.id}>
            <VinegarRecipe recipe={recipe} />
          </li>
        ))}
      </ul>
    </>
  )
}
