import React, { useContext } from 'react'

import { fermentableItemsMap } from '../../data/maps'
import FarmhandContext from '../Farmhand/Farmhand.context'
import { getCropsAvailableToFerment } from '../../utils/getCropsAvailableToFerment'

import { FermentationRecipe } from './FermentationRecipe'

const totalFermentableItems = Object.keys(fermentableItemsMap).length

export const FermentationRecipeList = () => {
  const {
    gameState: { levelEntitlements },
  } = useContext(FarmhandContext)

  const cropsAvailableToFerment = getCropsAvailableToFerment(levelEntitlements)

  const numberOfCropsAvailableToFerment = Object.keys(cropsAvailableToFerment)
    .length

  return (
    <>
      <h3>
        Learned Fermentation Recipes ({numberOfCropsAvailableToFerment} /{' '}
        {totalFermentableItems})
      </h3>
      <ul className="card-list">
        {cropsAvailableToFerment.map(item => (
          <li key={item.id}>
            <FermentationRecipe item={item} />
          </li>
        ))}
      </ul>
    </>
  )
}

FermentationRecipeList.propTypes = {}
