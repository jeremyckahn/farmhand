import React, { useState, useContext } from 'react'

import SearchBar from '../SearchBar/index.js'
import { getWineVarietiesAvailableToMake } from '../../utils/getWineVarietiesAvailableToMake.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'

import { grapeVariety } from '../../enums.js'

import { WineRecipe } from './WineRecipe.js'

const totalGrapeVarieties = Object.keys(grapeVariety).length

export const WineRecipeList = () => {
  const {
    gameState: { itemsSold },
  } = useContext(FarmhandContext)

  const wineVarietiesAvailableToMake = getWineVarietiesAvailableToMake(
    itemsSold
  )

  const [searchQuery, setSearchQuery] = useState('')

  const filteredWineVarieties = wineVarietiesAvailableToMake.filter(
    wineVariety => wineVariety.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const numberOfWineVarietiesAvailableToMake = filteredWineVarieties.length

  return (
    <>
      <h3>
        Available Wine Recipes ({numberOfWineVarietiesAvailableToMake} /{' '}
        {totalGrapeVarieties})
      </h3>

      {wineVarietiesAvailableToMake.length > 0 && (
        <SearchBar
          placeholder="Search wine varieties..."
          onSearch={setSearchQuery}
        />
      )}

      <ul className="card-list">
        {filteredWineVarieties.map(wineVariety => (
          <li key={wineVariety}>
            <WineRecipe wineVariety={wineVariety} />
          </li>
        ))}
      </ul>
    </>
  )
}
