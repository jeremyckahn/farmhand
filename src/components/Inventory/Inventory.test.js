import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

import { testItem } from '../../test-utils/index.js'
import { sortItems } from '../../utils/index.js'
import { generateValueAdjustments } from '../../common/utils.js'
import { pumpkinSeed, carrotSeed } from '../../data/crops/index.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'

import Inventory from './Inventory.js'

const defaultGameState = {
  valueAdjustments: generateValueAdjustments(),
  historicalValueAdjustments: [],
  inventory: [],
  playerInventoryQuantities: {},
  completedAchievements: {},
  inventoryLimit: 100,
  money: 500,
}

vitest.useFakeTimers()

const StubInventory = ({ gameState = {}, ...overrides }) => {
  return (
    <FarmhandContext.Provider
      value={{ gameState: { ...defaultGameState, ...gameState }, handlers: {} }}
    >
      <Inventory
        items={[]}
        playerInventory={[]}
        shopInventory={[]}
        {...overrides}
      />
    </FarmhandContext.Provider>
  )
}
describe('Inventory Component', () => {
  describe('Displaying items', () => {
    test('displays all items when no categories are selected', () => {
      const items = [
        testItem({ id: 'carrot', name: 'Carrot' }),
        testItem({ id: 'pumpkin', name: 'Pumpkin' }),
        testItem({ id: 'carrot-seed', name: 'Carrot Seed' }),
      ]
      render(<StubInventory items={items} selectedCategories={[]} />)
      items.forEach(item => {
        expect(screen.getByText(item.name)).toBeInTheDocument()
      })
    })

    test('filters items by search query', () => {
      const items = [
        testItem({ id: 'carrot', name: 'Carrot', category: 'CROPS' }),
        testItem({
          id: 'pumpkin-seed',
          name: 'Pumpkin Seed',
          category: 'SEEDS',
        }),
      ]

      render(<StubInventory items={items} selectedCategories={[]} />)

      const searchInput = screen.getByPlaceholderText('Search inventory...')
      fireEvent.change(searchInput, { target: { value: 'Carrot' } })

      vitest.runAllTimers()

      expect(screen.getByText('Carrot')).toBeInTheDocument()
      expect(screen.queryByText('Pumpkin Seed')).not.toBeInTheDocument()
    })
  })

  describe('SearchBar functionality', () => {
    test('renders SearchBar with correct placeholder', () => {
      render(
        <StubInventory
          items={[]}
          selectedCategories={[]}
          searchQuery=""
          onSearch={() => {}}
        />
      )

      const searchBar = screen.getByPlaceholderText('Search inventory...')
      expect(searchBar).toBeInTheDocument()
    })
  })

  describe('Item sorting and categorization', () => {
    test('sorts items by type and base value', () => {
      const sortedItems = sortItems([
        testItem({ id: pumpkinSeed.id, value: 0.5 }),
        testItem({ id: 'scarecrow' }),
        testItem({ id: 'sprinkler' }),
        testItem({ id: carrotSeed.id }),
      ])

      expect(sortedItems).toEqual([
        testItem({ id: carrotSeed.id }),
        testItem({ id: pumpkinSeed.id, value: 0.5 }),
        testItem({ id: 'sprinkler' }),
        testItem({ id: 'scarecrow' }),
      ])
    })
  })
})
