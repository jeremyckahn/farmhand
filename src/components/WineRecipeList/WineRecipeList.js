import React, { useContext } from 'react'

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

  const numberOfWineVarietiesAvailableToMake =
    wineVarietiesAvailableToMake.length

  return (
    <>
      <h3>
        Available Wine Recipes ({numberOfWineVarietiesAvailableToMake} /{' '}
        {totalGrapeVarieties})
      </h3>
      <ul className="card-list">
        {wineVarietiesAvailableToMake.map(wineVariety => (
          <li key={wineVariety}>
            <WineRecipe wineVariety={wineVariety} />
          </li>
        ))}
      </ul>
    </>
  )
}
