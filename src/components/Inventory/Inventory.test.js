import React from 'react'
import { shallow } from 'enzyme'

import Item from '../Item'
import { testItem } from '../../test-utils'
import { sortItems } from '../../utils'

import {
  Inventory,
  categoryIds,
  separateItemsIntoCategories,
} from './Inventory'

jest.mock('../../data/maps')
jest.mock('../../data/items')
jest.mock('../../data/levels', () => ({ levels: [], unlockableItems: {} }))
jest.mock('../../data/shop-inventory')

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

describe('rendering items', () => {
  test('shows the inventory', () => {
    component.setProps({ items: [testItem({ playerId: 'sample-item-1' })] })

    const li = component.find('li')
    expect(li).toHaveLength(1)
    expect(li.find(Item)).toHaveLength(1)
  })
})

describe('item sorting', () => {
  test('sorts by type and base value', () => {
    expect(
      sortItems([
        testItem({ playerId: 'sample-crop-seeds-2', value: 0.5 }),
        testItem({ playerId: 'scarecrow' }),
        testItem({ playerId: 'sprinkler' }),
        testItem({ playerId: 'sample-crop-seeds-1' }),
      ])
    ).toEqual([
      testItem({ playerId: 'sample-crop-seeds-1' }),
      testItem({ playerId: 'sample-crop-seeds-2', value: 0.5 }),
      testItem({ playerId: 'sprinkler' }),
      testItem({ playerId: 'scarecrow' }),
    ])
  })

  test('divides into type categories', () => {
    expect(
      separateItemsIntoCategories(
        [
          testItem({ playerId: 'sample-crop-seeds-2', isPlantableCrop: true }),
          testItem({ playerId: 'scarecrow' }),
          testItem({ playerId: 'sprinkler' }),
          testItem({ playerId: 'sample-crop-seeds-1', isPlantableCrop: true }),
          testItem({ playerId: 'sample-recipe-1' }),
          testItem({ playerId: 'cow-feed' }),
          testItem({ playerId: 'sample-crop-1' }),
          testItem({ playerId: 'milk-1' }),
          testItem({ playerId: 'stone' }),
          testItem({ playerId: 'iron-ore' }),
          testItem({ playerId: 'coal' }),
        ],
        {}
      )
    ).toEqual({
      [categoryIds.CROPS]: [testItem({ playerId: 'sample-crop-1' })],
      [categoryIds.FORAGED_ITEMS]: [],
      [categoryIds.MINED_RESOURCES]: [
        testItem({ playerId: 'coal' }),
        testItem({ playerId: 'stone' }),
        testItem({ playerId: 'iron-ore' }),
      ],
      [categoryIds.SEEDS]: [
        testItem({ playerId: 'sample-crop-seeds-1', isPlantableCrop: true }),
        testItem({ playerId: 'sample-crop-seeds-2', isPlantableCrop: true }),
      ],
      [categoryIds.FIELD_TOOLS]: [
        testItem({ playerId: 'sprinkler' }),
        testItem({ playerId: 'scarecrow' }),
      ],
      [categoryIds.ANIMAL_PRODUCTS]: [testItem({ playerId: 'milk-1' })],
      [categoryIds.ANIMAL_SUPPLIES]: [testItem({ playerId: 'cow-feed' })],
      [categoryIds.CRAFTED_ITEMS]: [testItem({ playerId: 'sample-recipe-1' })],
      [categoryIds.UPGRADES]: [],
    })
  })
})
