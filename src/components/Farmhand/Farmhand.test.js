import React from 'react'
import { shallow } from 'enzyme'

import {
  sampleItem1,
  sampleFieldTool1,
  sampleCropSeedsItem1,
} from '../../data/items'
import { PURCHASEABLE_COW_PENS } from '../../constants'
import { COW_PEN_PURCHASED } from '../../templates'

import Farmhand, {
  computePlayerInventory,
  getFieldToolInventory,
  getPlantableCropInventory,
} from './Farmhand'

jest.mock('../../data/maps')
jest.mock('../../data/items')
jest.mock('../../data/levels', () => ({ levels: [] }))
jest.mock('../../data/shop-inventory')

jest.mock('../../data/achievements', () => ({
  __esModule: true,
  ...jest.requireActual('../../data/achievements'),
  achievementsMap: {},
}))

jest.mock('../..//constants', () => ({
  __esModule: true,
  ...jest.requireActual('../../constants'),
  COW_HUG_BENEFIT: 0.5,
  CROW_CHANCE: 0,
  INITIAL_FIELD_HEIGHT: 4,
  INITIAL_FIELD_WIDTH: 4,
  PRECIPITATION_CHANCE: 0,
}))

let component

const localforageMock = {
  getItem: () => Promise.resolve(null),
  setItem: (_key, data) => Promise.resolve(data),
}

beforeEach(() => {
  jest.useFakeTimers()
  component = shallow(<Farmhand {...{ localforage: localforageMock }} />)
})

describe('private helpers', () => {
  describe('computePlayerInventory', () => {
    const inventory = [{ quantity: 1, id: 'sample-item-1' }]

    test('computes inventory with no value adjustments', () => {
      const playerInventory = computePlayerInventory(inventory, {})

      expect(playerInventory).toEqual([{ quantity: 1, ...sampleItem1 }])
    })

    test('computes inventory with value adjustments', () => {
      const playerInventory = computePlayerInventory(inventory, {
        'sample-item-1': 2,
      })

      expect(playerInventory).toEqual([
        { ...sampleItem1, quantity: 1, value: 2 },
      ])
    })
  })

  describe('getFieldToolInventory', () => {
    test('selects field tools from inventory', () => {
      const fieldToolInventory = getFieldToolInventory([
        sampleFieldTool1,
        sampleCropSeedsItem1,
      ])

      expect(fieldToolInventory).toEqual([sampleFieldTool1])
    })
  })

  describe('getPlantableCropInventory', () => {
    test('selects plantable crop items from inventory', () => {
      const inventory = [{ id: 'sample-crop-seeds-1' }, { id: 'sample-item-1' }]
      const plantableCropInventory = getPlantableCropInventory(inventory)

      expect(plantableCropInventory).toEqual([sampleCropSeedsItem1])
    })
  })
})

describe('instance methods', () => {
  describe('showCowPenPurchasedNotifications', () => {
    describe('cow pen purchasing', () => {
      test('does show notification', () => {
        component.setState({ purchasedCowPen: 1 })
        component
          .instance()
          .showCowPenPurchasedNotifications({ purchasedCowPen: 0 })

        expect(component.state().todaysNotifications).toContainEqual({
          message: COW_PEN_PURCHASED`${PURCHASEABLE_COW_PENS.get(1).cows}`,
          severity: 'info',
        })
      })
    })
  })
})
