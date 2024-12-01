import React from 'react'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import { getLevelEntitlements } from '../../utils/getLevelEntitlements.js'
import { getCropsAvailableToFerment } from '../../utils/getCropsAvailableToFerment.js'
import { fermentableItemsMap } from '../../data/maps.js'

import { FermentationRecipeList } from './FermentationRecipeList.js'

const totalFermentableItems = Object.keys(fermentableItemsMap).length

vitest.mock('./FermentationRecipe.js', () => ({
  FermentationRecipe: ({ item }) => <div>{item.name}</div>,
}))

const FermentationRecipeListStub = ({ levelEntitlements } = {}) => (
  <FarmhandContext.Provider
    value={{
      gameState: {
        levelEntitlements,
      },
      handlers: {},
    }}
  >
    <FermentationRecipeList />
  </FarmhandContext.Provider>
)

describe('FermentationRecipeList', () => {
  test('displays unlearned recipes', () => {
    const levelEntitlements = getLevelEntitlements(0)

    render(<FermentationRecipeListStub levelEntitlements={levelEntitlements} />)
    const header = screen.getByText(
      `Available Fermentation Recipes (0 / ${totalFermentableItems})`
    )

    expect(header).toBeInTheDocument()
  })

  test('displays available recipes', () => {
    const levelEntitlements = getLevelEntitlements(100)

    render(<FermentationRecipeListStub levelEntitlements={levelEntitlements} />)

    const cropsAvailableToFerment = getCropsAvailableToFerment(
      levelEntitlements
    )

    const header = screen.getByText(
      `Available Fermentation Recipes (${cropsAvailableToFerment.length} / ${totalFermentableItems})`
    )

    expect(header).toBeInTheDocument()
  })

  test('filters recipes based on search query', async () => {
    const levelEntitlements = getLevelEntitlements(100)
    const cropsAvailableToFerment = getCropsAvailableToFerment(
      levelEntitlements
    )

    render(<FermentationRecipeListStub levelEntitlements={levelEntitlements} />)

    const searchBar = screen.getByPlaceholderText(
      'Search fermentation recipes...'
    )
    expect(searchBar).toBeInTheDocument()

    await userEvent.type(searchBar, 'apple')

    const filteredCrops = cropsAvailableToFerment.filter(item => {
      const fermentationRecipeName = `Fermented ${item.name}`.toLowerCase()
      return (
        fermentationRecipeName.includes('apple') ||
        item.name.toLowerCase().includes('apple')
      )
    })

    filteredCrops.forEach(crop => {
      expect(screen.getByText(crop.name)).toBeInTheDocument()
    })

    const nonMatchingCrops = cropsAvailableToFerment.filter(
      item => !filteredCrops.includes(item)
    )

    nonMatchingCrops.forEach(crop => {
      const nonMatchingElements = screen.queryAllByText(crop.name)
      expect(nonMatchingElements).toHaveLength(1)
    })
  })

  test('handles empty search query', async () => {
    const levelEntitlements = getLevelEntitlements(100)
    const cropsAvailableToFerment = getCropsAvailableToFerment(
      levelEntitlements
    )

    render(<FermentationRecipeListStub levelEntitlements={levelEntitlements} />)

    const searchBar = screen.getByPlaceholderText(
      'Search fermentation recipes...'
    )
    expect(searchBar).toBeInTheDocument()

    await userEvent.clear(searchBar)

    cropsAvailableToFerment.forEach(crop => {
      expect(screen.getByText(crop.name)).toBeInTheDocument()
    })
  })
})
