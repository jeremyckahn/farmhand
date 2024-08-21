/**
 * @typedef {import('../../index').farmhand.levelEntitlements} levelEntitlements
 */
import React from 'react'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'

import FarmhandContext from '../Farmhand/Farmhand.context'
import { getLevelEntitlements } from '../../utils/getLevelEntitlements'
import { getCropsAvailableToFerment } from '../../utils/getCropsAvailableToFerment'
import { fermentableItemsMap } from '../../data/maps'

import { FermentationRecipeList } from './FermentationRecipeList'

const totalFermentableItems = Object.keys(fermentableItemsMap).length

vitest.mock('./FermentationRecipe', () => ({
  FermentationRecipe: () => <></>,
}))

/**
 * @param {Object} props
 * @param {levelEntitlements} props.levelEntitlements
 */
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
})
