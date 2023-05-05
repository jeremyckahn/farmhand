import React, { useContext } from 'react'

import { itemsMap, fermentableItemsMap } from '../../data/maps'
import FarmhandContext from '../Farmhand/Farmhand.context'
import { getFinalCropItemFromSeedItem } from '../../utils'

import { FermentationRecipe } from './FermentationRecipe'

const totalFermentableItems = Object.keys(fermentableItemsMap).length

export function FermentationRecipeList() {
  const {
    gameState: { levelEntitlements },
  } = useContext(FarmhandContext)

  const cropsAvailableToFerment = Object.keys(levelEntitlements.items)
    .map(itemId => getFinalCropItemFromSeedItem(itemsMap[itemId]))
    .filter(item => (item ? 'daysToFerment' in item : false))

  const numberOfCropsAvailableToFerment = Object.keys(cropsAvailableToFerment)
    .length

  // FIXME: Test recipe count display
  return (
    <>
      <h3>
        Learned Fermentation Recipes ({numberOfCropsAvailableToFerment} /{' '}
        {totalFermentableItems})
      </h3>
      <ul className="card-list">
        {cropsAvailableToFerment.map(item => (
          <FermentationRecipe key={item.id} item={item} />
        ))}
      </ul>
    </>
  )
}

FermentationRecipeList.propTypes = {}
