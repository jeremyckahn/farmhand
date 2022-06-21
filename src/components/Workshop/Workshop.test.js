import React from 'react'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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
    'forge-recipe-1': {
      id: 'forge-recipe-1',
      name: 'forge recipe 1',
      recipeType: 'FORGE',
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
    let numLearnedRecipes = 0
    beforeEach(() => {
      numLearnedRecipes = Object.keys(gameState.learnedRecipes).length

      gameState.learnedRecipes = {
        'kitchen-recipe-1': true,
      }

      renderWorkshop(gameState)
    })

    test('is available', () => {
      expect(screen.getByText('Kitchen')).toBeInTheDocument()
    })

    test('renders learned recipes', () => {
      expect(
        screen.getByText(`Learned Recipes (${numLearnedRecipes}`, {
          exact: false,
        })
      ).toBeInTheDocument()
    })

    test('renders a Recipe card for each learned recipe', () => {
      const recipesList = screen.getByText('Learned Recipes', { exact: false })
        .nextElementSibling

      expect(recipesList.querySelectorAll('li')).toHaveLength(numLearnedRecipes)
    })
  })

  describe('forge', () => {
    describe('has not purchased smelter', () => {
      test('is not rendered', () => {
        renderWorkshop(gameState)

        expect(screen.queryByText('Forge')).not.toBeInTheDocument()
      })
    })

    describe('has purchased smelter', () => {
      beforeEach(() => {
        gameState.purchasedSmelter = true
        gameState.learnedRecipes = {
          'forge-recipe-1': true,
        }

        renderWorkshop(gameState)

        userEvent.click(screen.getByText('Forge'))
      })

      test('is rendered', () => {
        expect(screen.getByText('Forge')).toBeInTheDocument()
      })

      test('renders a Recipe card for each learned recipe', () => {
        const recipesList = screen.getByText('Learned Recipes', {
          exact: false,
        }).nextElementSibling

        expect(recipesList.querySelectorAll('li')).toHaveLength(1)
      })
    })
  })
})
