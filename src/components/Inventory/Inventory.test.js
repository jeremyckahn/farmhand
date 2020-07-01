import React from 'react'
import { shallow } from 'enzyme'

import Item from '../Item'
import { testItem } from '../../test-utils'

import {
  Inventory,
  categoryIds,
  separateItemsIntoCategories,
  sort,
} from './Inventory'

jest.mock('../../data/maps')
jest.mock('../../data/items')
jest.mock('../../data/shop-inventory')

let component

beforeEach(() => {
  component = shallow(
    <Inventory
      {...{
        items: [],
        valueAdjustments: {},
      }}
    />
  )
})

describe('rendering items', () => {
  test('shows the inventory', () => {
    component.setProps({ items: [testItem({ id: 'sample-item-1' })] })

    const li = component.find('li')
    expect(li).toHaveLength(1)
    expect(li.find(Item)).toHaveLength(1)
  })
})

describe('item sorting', () => {
  test('sorts by type and base value', () => {
    expect(
      sort([
        testItem({ id: 'sample-crop-seeds-2', value: 0.5 }),
        testItem({ id: 'scarecrow' }),
        testItem({ id: 'sprinkler' }),
        testItem({ id: 'sample-crop-seeds-1' }),
      ])
    ).toEqual([
      testItem({ id: 'sample-crop-seeds-1' }),
      testItem({ id: 'sample-crop-seeds-2', value: 0.5 }),
      testItem({ id: 'sprinkler' }),
      testItem({ id: 'scarecrow' }),
    ])
  })

  test('divides into type categories', () => {
    expect(
      separateItemsIntoCategories([
        testItem({ id: 'sample-crop-seeds-2', isPlantableCrop: true }),
        testItem({ id: 'scarecrow' }),
        testItem({ id: 'sprinkler' }),
        testItem({ id: 'sample-crop-seeds-1', isPlantableCrop: true }),
        testItem({ id: 'sample-recipe-1' }),
        testItem({ id: 'cow-feed' }),
        testItem({ id: 'sample-crop-1' }),
        testItem({ id: 'milk-1' }),
      ])
    ).toEqual({
      [categoryIds.CROPS]: [testItem({ id: 'sample-crop-1' })],
      [categoryIds.SEEDS]: [
        testItem({ id: 'sample-crop-seeds-1', isPlantableCrop: true }),
        testItem({ id: 'sample-crop-seeds-2', isPlantableCrop: true }),
      ],
      [categoryIds.FIELD_TOOLS]: [
        testItem({ id: 'sprinkler' }),
        testItem({ id: 'scarecrow' }),
      ],
      [categoryIds.ANIMAL_PRODUCTS]: [testItem({ id: 'milk-1' })],
      [categoryIds.ANIMAL_SUPPLIES]: [testItem({ id: 'cow-feed' })],
      [categoryIds.DISHES]: [testItem({ id: 'sample-recipe-1' })],
    })
  })
})
