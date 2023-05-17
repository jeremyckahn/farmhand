import React from 'react'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'

import FarmhandContext from '../Farmhand/Farmhand.context'

import { getLevelEntitlements } from '../../utils/getLevelEntitlements'

import { FermentationRecipeList } from './FermentationRecipeList'

jest.mock('./FermentationRecipe', () => ({
  FermentationRecipe: () => <></>,
}))

const FermentationRecipeListStub = ({
  levelEntitlements = getLevelEntitlements(0),
} = {}) => (
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
    render(<FermentationRecipeListStub />)

    const header = screen.getByText(`Learned Fermentation Recipes (0 / 2)`)

    expect(header).toBeInTheDocument()
  })

  test('displays learned recipes', () => {
    const levelEntitlements = getLevelEntitlements(100)

    render(<FermentationRecipeListStub levelEntitlements={levelEntitlements} />)

    const header = screen.getByText(`Learned Fermentation Recipes (2 / 2)`)

    expect(header).toBeInTheDocument()
  })
})
