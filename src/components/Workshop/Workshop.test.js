import React from 'react'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import FarmhandContext from '../Farmhand/Farmhand.context.js'

import { getUpgradesAvailable } from './getUpgradesAvailable.js'

import Workshop from './Workshop.js'

vitest.mock('./getUpgradesAvailable.js')

vitest.mock('../../data/maps.js', async importOriginal => ({
  ...(await importOriginal()),
  recipesMap: {
    'kitchen-recipe-1': {
      id: 'kitchen-recipe-1',
      name: 'kitchen recipe 1',
      recipeType: 'KITCHEN',
    },
    'kitchen-recipe-2': {
      id: 'kitchen-recipe-2',
      name: 'kitchen recipe 2',
      recipeType: 'KITCHEN',
    },
    'kitchen-recipe-3': {
      id: 'kitchen-recipe-3',
      name: 'kitchen recipe 3',
      recipeType: 'KITCHEN',
    },
    'forge-recipe-1': {
      id: 'forge-recipe-1',
      name: 'forge recipe 1',
      recipeType: 'FORGE',
    },
    'forge-recipe-2': {
      id: 'forge-recipe-2',
      name: 'forge recipe 2',
      recipeType: 'FORGE',
    },
    'recycling-recipe-1': {
      id: 'recycling-recipe-1',
      name: 'recycling recipe 1',
      recipeType: 'RECYCLING',
    },
  },
}))

vitest.mock('../Recipe', () => {
  return { default: () => <div data-testid="Recipe">Recipe</div> }
})
vitest.mock('../UpgradePurchase', () => {
  return {
    default: () => <div data-testid="UpgradePurchase">UpgradePurchase</div>,
  }
})

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
      <FarmhandContext.Provider
        value={{
          gameState,
          // @ts-expect-error
          handlers: {},
        }}
      >
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
      beforeEach(async () => {
        // @ts-expect-error - Mock function type assertion
        getUpgradesAvailable.mockReturnValue([])

        gameState.purchasedSmelter = 1
        gameState.learnedRecipes = {
          'forge-recipe-1': true,
          'forge-recipe-2': true,
        }

        renderWorkshop(gameState)

        await userEvent.click(screen.getByText('Forge'))
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
      beforeEach(async () => {
        const availableUpgrades = [{ id: 'upgrade-1' }, { id: 'upgrade-2' }]
        // @ts-expect-error - Mock function type assertion
        getUpgradesAvailable.mockReturnValue(availableUpgrades)
        gameState.purchasedSmelter = 1

        renderWorkshop(gameState)

        await userEvent.click(screen.getByText('Forge'))
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
      beforeEach(async () => {
        gameState.purchasedComposter = 1
        gameState.learnedRecipes = {
          'recycling-recipe-1': true,
        }

        renderWorkshop(gameState)

        await userEvent.click(screen.getByText('Recycling'))
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
