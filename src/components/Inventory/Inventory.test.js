import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

import { carrotSoup } from '../../data/recipes.js'

import { testItem } from '../../test-utils/index.js'
import { sortItems } from '../../utils/index.js'
import { carrot, pumpkinSeed, carrotSeed } from '../../data/crops/index.js'

import Inventory from './Inventory.js'

import { categoryIds, separateItemsIntoCategories } from './Inventory.js'

describe('Inventory Component', () => {
  describe('Displaying items', () => {
    test('displays all items when no categories are selected', () => {
      const items = [
        { id: '1', name: 'Carrot', category: 'CROPS' },
        { id: '2', name: 'Pumpkin', category: 'CROPS' },
        { id: '3', name: 'Carrot Seed', category: 'SEEDS' },
      ]

      render(<Inventory items={items} selectedCategories={[]} />)
      items.forEach(item => {
        expect(screen.getByText(item.name)).toBeInTheDocument()
      })
    })

    test('filters items by search query', () => {
      const items = [
        { id: '1', name: 'Carrot', category: 'CROPS' },
        { id: '2', name: 'Pumpkin Seed', category: 'SEEDS' },
      ]

      render(<Inventory items={items} selectedCategories={[]} />)

      const searchInput = screen.getByPlaceholderText('Search inventory...')
      fireEvent.change(searchInput, { target: { value: 'Carrot' } })

      expect(screen.getByText('Carrot')).toBeInTheDocument()
      expect(screen.queryByText('Pumpkin Seed')).not.toBeInTheDocument()
    })
  })

  describe('SearchBar functionality', () => {
    test('renders SearchBar with correct placeholder', () => {
      render(
        <Inventory
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

    test('categorizes items into correct categories', () => {
      const categorizedItems = separateItemsIntoCategories(
        [
          testItem({ id: pumpkinSeed.id, isPlantableCrop: true }),
          testItem({ id: 'scarecrow' }),
          testItem({ id: 'sprinkler' }),
          testItem({ id: carrotSeed.id, isPlantableCrop: true }),
          testItem({ id: carrotSoup.id }),
          testItem({ id: 'cow-feed' }),
          testItem({ id: carrot.id }),
          testItem({ id: 'milk-1' }),
          testItem({ id: 'stone' }),
          testItem({ id: 'iron-ore' }),
          testItem({ id: 'coal' }),
        ],
        {}
      )

      // Проверяем заполнение всех категорий
      expect(categorizedItems).toEqual({
        [categoryIds.CROPS]: [testItem({ id: carrot.id })],
        [categoryIds.FORAGED_ITEMS]: [],
        [categoryIds.MINED_RESOURCES]: [
          testItem({ id: 'coal' }),
          testItem({ id: 'stone' }),
          testItem({ id: 'iron-ore' }),
        ],
        [categoryIds.SEEDS]: [
          testItem({ id: carrotSeed.id, isPlantableCrop: true }),
          testItem({ id: pumpkinSeed.id, isPlantableCrop: true }),
        ],
        [categoryIds.FIELD_TOOLS]: [
          testItem({ id: 'sprinkler' }),
          testItem({ id: 'scarecrow' }),
        ],
        [categoryIds.ANIMAL_PRODUCTS]: [testItem({ id: 'milk-1' })],
        [categoryIds.ANIMAL_SUPPLIES]: [testItem({ id: 'cow-feed' })],
        [categoryIds.CRAFTED_ITEMS]: [testItem({ id: carrotSoup.id })],
        [categoryIds.UPGRADES]: [], // Пустая категория
      })
    })
  })
})
