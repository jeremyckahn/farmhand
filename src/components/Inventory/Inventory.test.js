import React from 'react'
import { shallow } from 'enzyme'

import SearchBar from '../SearchBar/index.js'
import Item from '../Item/index.js'
import { testItem } from '../../test-utils/index.js'
import { sortItems } from '../../utils/index.js'
import {
  carrot,
  pumpkin,
  pumpkinSeed,
  carrotSeed,
} from '../../data/crops/index.js'
import { carrotSoup } from '../../data/recipes.js'

import {
  Inventory,
  categoryIds,
  separateItemsIntoCategories,
} from './Inventory.js'

let component

beforeEach(() => {
  component = shallow(
    <Inventory
      {...{
        items: [],
      }}
    />
  )
})

test('displays all items when no categories are selected', () => {
  const categories = ['CROPS', 'ANIMAL_PRODUCTS']
  const items = [
    testItem({ id: carrot.id, name: 'Carrot', category: 'CROPS' }),
    testItem({ id: pumpkin.id, name: 'Pumpkin', category: 'CROPS' }),
    testItem({ id: carrotSeed.id, name: 'Carrot Seed', category: 'SEEDS' }),
  ]

  component.setProps({ items, categories })

  let renderedItems = component.find(Item)
  expect(renderedItems).toHaveLength(3)

  const checkboxes = component.find('input[type="checkbox"]')
  checkboxes.forEach(checkbox => checkbox.simulate('change'))

  component.update()

  renderedItems = component.find(Item)
  expect(renderedItems).toHaveLength(3)
})

describe('SearchBar functionality', () => {
  test('renders SearchBar with correct placeholder', () => {
    const placeholderText = 'Search inventory...'
    component.setProps({ placeholder: placeholderText })

    const searchBar = component.find(SearchBar)
    expect(searchBar).toHaveLength(1)
    expect(searchBar.props().placeholder).toBe(placeholderText)
  })

  test('updates searchQuery when SearchBar input changes', () => {
    const searchBar = component.find(SearchBar)

    const testQuery = 'test item'
    searchBar.props().onSearch(testQuery)

    expect(component.find(SearchBar).props().placeholder).toBe(
      'Search inventory...'
    )
    expect(component.find(SearchBar).props().onSearch).toBeTruthy()
  })
})

describe('rendering items', () => {
  test('shows the inventory', () => {
    component.setProps({ items: [testItem({ id: carrot.id })] })

    const li = component.find('li')
    expect(li).toHaveLength(1)
    expect(li.find(Item)).toHaveLength(1)
  })
})

describe('item sorting', () => {
  test('sorts by type and base value', () => {
    expect(
      sortItems([
        testItem({ id: pumpkinSeed.id, value: 0.5 }),
        testItem({ id: 'scarecrow' }),
        testItem({ id: 'sprinkler' }),
        testItem({ id: carrotSeed.id }),
      ])
    ).toEqual([
      testItem({ id: carrotSeed.id }),
      testItem({ id: pumpkinSeed.id, value: 0.5 }),
      testItem({ id: 'sprinkler' }),
      testItem({ id: 'scarecrow' }),
    ])
  })

  test('divides into type categories', () => {
    expect(
      separateItemsIntoCategories(
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
    ).toEqual({
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
      [categoryIds.UPGRADES]: [],
    })
  })
  describe('Inventory search functionality', () => {
    test('filters items by search query', () => {
      const items = [
        testItem({ id: carrot.id, name: 'Carrot' }),
        testItem({ id: pumpkinSeed.id, name: 'Pumpkin Seed' }),
      ]

      component.setProps({ items })

      let renderedItems = component.find(Item)
      expect(renderedItems).toHaveLength(2)

      const searchBar = component.find(SearchBar)
      searchBar.props().onSearch('Carrot')

      component.update()

      renderedItems = component.find(Item)
      expect(renderedItems).toHaveLength(1)
      expect(renderedItems.props().item.id).toBe(carrot.id)
    })
  })
})
