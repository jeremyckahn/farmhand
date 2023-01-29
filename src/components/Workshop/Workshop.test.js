import React from 'react'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import FarmhandContext from '../Farmhand/Farmhand.context'

import { getUpgradesAvailable } from './getUpgradesAvailable'

import Workshop from './Workshop'

jest.mock('./getUpgradesAvailable')

jest.mock('../../data/maps', () => ({
  ...jest.requireActual('../../data/maps'),
  recipesMap: {
    'kitchen-recipe-1': {
      playerId: 'kitchen-recipe-1',
      name: 'kitchen recipe 1',
      recipeType: 'KITCHEN',
    },
    'kitchen-recipe-2': {
      playerId: 'kitchen-recipe-2',
      name: 'kitchen recipe 2',
      recipeType: 'KITCHEN',
    },
    'kitchen-recipe-3': {
      playerId: 'kitchen-recipe-3',
      name: 'kitchen recipe 3',
      recipeType: 'KITCHEN',
    },
    'forge-recipe-1': {
      playerId: 'forge-recipe-1',
      name: 'forge recipe 1',
      recipeType: 'FORGE',
    },
    'forge-recipe-2': {
      playerId: 'forge-recipe-2',
      name: 'forge recipe 2',
      recipeType: 'FORGE',
    },
    'recycling-recipe-1': {
      playerId: 'recycling-recipe-1',
      name: 'recycling recipe 1',
      recipeType: 'RECYCLING',
    },
  },
}))

jest.mock('../Recipe', () => () => <div data-testid="Recipe">Recipe</div>)
jest.mock('../UpgradePurchase', () => () => (
  <div data-testid="UpgradePurchase">UpgradePurchase</div>
))

describe('<Workshop />', () => {
  let gameState

  beforeEach(() => {
    gameState = {
      learnedRecipes: {},
      purchasedComposter: 0,
      purchasedSmelter: 0,
      toolLevels: {},
    }
  })

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
      gameState.learnedRecipes = {
        'kitchen-recipe-1': true,
        'kitchen-recipe-2': true,
        'kitchen-recipe-3': true,
      }

      numLearnedRecipes = Object.keys(gameState.learnedRecipes).length

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
      expect(screen.getAllByTestId('Recipe')).toHaveLength(numLearnedRecipes)
    })
  })

  describe('forge', () => {
    describe('player has not purchased the smelter', () => {
      test('is not rendered', () => {
        renderWorkshop(gameState)

        expect(screen.queryByText('Forge')).not.toBeInTheDocument()
      })
    })

    describe('player has purchased the smelter', () => {
      beforeEach(() => {
        getUpgradesAvailable.mockReturnValue([])

        gameState.purchasedSmelter = 1
        gameState.learnedRecipes = {
          'forge-recipe-1': true,
          'forge-recipe-2': true,
        }

        renderWorkshop(gameState)

        userEvent.click(screen.getByText('Forge'))
      })

      test('is rendered', () => {
        expect(
          screen.getByText(
            'Forge recipes are learned by selling resources mined from the field.'
          )
        ).toBeInTheDocument()
      })

      test('renders a Recipe card for each learned recipe', () => {
        expect(screen.getAllByTestId('Recipe')).toHaveLength(2)
      })
    })

    describe('has upgrades available', () => {
      beforeEach(() => {
        const availableUpgrades = [{ playerId: 'upgrade-1' }, { playerId: 'upgrade-2' }]

        getUpgradesAvailable.mockReturnValue(availableUpgrades)
        gameState.purchasedSmelter = 1

        renderWorkshop(gameState)

        userEvent.click(screen.getByText('Forge'))
      })

      test('renders upgrades heading', () => {
        expect(screen.getByText('Tool Upgrades')).toBeInTheDocument()
      })

      it('renders an UpgradePurchase card for each upgrade available', () => {
        expect(screen.getAllByTestId('UpgradePurchase')).toHaveLength(2)
      })
    })
  })

  describe('recycling', () => {
    describe('player has not purchased the composter', () => {
      test('is not rendered', () => {
        renderWorkshop(gameState)

        expect(screen.queryByText('Recycling')).not.toBeInTheDocument()
      })
    })

    describe('player has purchased the composter', () => {
      beforeEach(() => {
        gameState.purchasedComposter = 1
        gameState.learnedRecipes = {
          'recycling-recipe-1': true,
        }

        renderWorkshop(gameState)

        userEvent.click(screen.getByText('Recycling'))
      })

      test('is rendered', () => {
        expect(
          screen.getByText(
            'Recyling recipes are learned by selling items foraged from the field.'
          )
        ).toBeInTheDocument()
      })

      test('renders a Recipe card for each learned recipe', () => {
        expect(screen.getAllByTestId('Recipe')).toHaveLength(1)
      })
    })
  })
})
