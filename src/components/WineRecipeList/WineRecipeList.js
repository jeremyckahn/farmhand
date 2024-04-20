import React, { useContext } from 'react'

import { getWineVarietiesAvailableToMake } from '../../utils/getWineVarietiesAvailableToMake'
import FarmhandContext from '../Farmhand/Farmhand.context'
import { grapeVariety } from '../../enums'

import { WineRecipe } from './WineRecipe'

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
