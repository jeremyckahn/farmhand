import React from 'react'
import { screen, render } from '@testing-library/react'

import FarmhandContext from '../Farmhand/Farmhand.context'

import Workshop from './Workshop'

jest.mock('../../data/maps', () => ({
  ...jest.requireActual('../../data/maps'),
  recipesMap: {
    'kitchen-recipe-1': {
      id: 'kitchen-recipe-1',
      name: 'kitchen recipe 1',
      recipeType: 'KITCHEN',
    },
  },
}))

jest.mock('../Recipe', () => () => 'Recipe')

describe('<Workshop />', () => {
  let gameState = {
    learnedRecipes: {},
    purchasedSmelter: false,
    toolLevels: {},
  }

  const renderWorkshop = gameState => {
    render(
      <FarmhandContext.Provider value={{ gameState, handlers: {} }}>
        <Workshop />
      </FarmhandContext.Provider>
    )
  }

  describe('kitchen', () => {
    test('is available', () => {
      renderWorkshop(gameState)

      expect(screen.getByText('Kitchen')).toBeInTheDocument()
    })

    test('renders learned recipes', () => {
      gameState.learnedRecipes = {
        'kitchen-recipe-1': true,
      }
      renderWorkshop(gameState)

      expect(
        screen.getByText('Learned Recipes (1', { exact: false })
      ).toBeInTheDocument()
    })
  })

  describe('forge', () => {
    test('is rendered if smelter is purchased', () => {
      gameState.purchasedSmelter = true

      renderWorkshop(gameState)

      expect(screen.getByText('Forge')).toBeInTheDocument()
    })

    test('is not rendered if smelter is not purchased', () => {
      gameState.purchasedSmelter = false

      renderWorkshop(gameState)

      expect(screen.queryByText('Forge')).not.toBeInTheDocument()
    })
  })
})
