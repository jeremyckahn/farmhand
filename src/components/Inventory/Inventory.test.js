import React from 'react'
import { shallow } from 'enzyme'

import Item from '../Item'
import { testItem } from '../../test-utils'
import { sortItems } from '../../utils'
import { carrot, carrotSeed, pumpkinSeed } from '../../data/crops'
import { carrotSoup } from '../../data/recipes'

import {
  Inventory,
  categoryIds,
  separateItemsIntoCategories,
} from './Inventory'

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
})
