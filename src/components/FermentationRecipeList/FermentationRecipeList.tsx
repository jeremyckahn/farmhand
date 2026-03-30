import React, { useState, useContext } from 'react'

import { fermentableItemsMap } from '../../data/maps.ts'
import FarmhandContext from '../Farmhand/Farmhand.context.tsx'
import { getCropsAvailableToFerment } from '../../utils/getCropsAvailableToFerment.ts'

import { FERMENTED_CROP_NAME } from '../../templates.ts'

import SearchBar from '../SearchBar/index.ts'

import { FermentationRecipe } from './FermentationRecipe.tsx'

const totalFermentableItems = Object.keys(fermentableItemsMap).length

export const FermentationRecipeList = () => {
  const {
    gameState: { levelEntitlements },
  } = useContext(FarmhandContext)

  const cropsAvailableToFerment = getCropsAvailableToFerment(levelEntitlements)

  const [searchQuery, setSearchQuery] = useState('')

  const searchTerms = searchQuery
    .toLowerCase()
    .split(' ')
    .filter(term => term.length > 0)

  const filteredCrops = cropsAvailableToFerment.filter(item => {
    // @ts-expect-error
    const fermentationRecipeName = `${FERMENTED_CROP_NAME}${item.name}`.toLowerCase()
    return searchTerms.every(
      term =>
        fermentationRecipeName.includes(term) ||
        // @ts-expect-error
        item.name.toLowerCase().includes(term)
    )
  })

  const numberOfCropsAvailableToFerment = filteredCrops.length

  return (
    <>
      <h3>
        Available Fermentation Recipes ({numberOfCropsAvailableToFerment} /{' '}
        {totalFermentableItems})
      </h3>
      {cropsAvailableToFerment.length > 0 && (
        <SearchBar
          placeholder="Search fermentation recipes..."
          onSearch={setSearchQuery}
        />
      )}
      {filteredCrops.length > 0 && (
        <ul className="card-list">
          {filteredCrops.map(item => (
            // @ts-expect-error
            <li key={item.id}>
              <FermentationRecipe item={item} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

FermentationRecipeList.propTypes = {}
