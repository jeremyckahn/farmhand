import React from 'react'
import { shallow } from 'enzyme'

import {
  sampleItem1,
  sampleFieldTool1,
  sampleCropSeedsItem1,
} from '../../data/items'
import { PURCHASEABLE_COW_PENS } from '../../constants'
import {
  COW_PEN_PURCHASED,
  LOAN_BALANCE_NOTIFICATION,
  RECIPE_LEARNED,
  RECIPES_LEARNED,
} from '../../templates'
import { reduceByPersistedKeys } from '../../utils'
import { recipesMap } from '../../data/maps'

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

  describe('showRecipeLearnedNotifications', () => {
    describe('no new recipes were learned', () => {
      test('does not show notification', () => {
        component.setState({ learnedRecipes: {} })
        component.update()

        expect(component.state().todaysNotifications).not.toContainEqual({
          message: RECIPE_LEARNED`${recipesMap['sample-recipe-1']}`,
          severity: 'info',
        })
      })
    })

    describe('new recipe was learned', () => {
      test('does show notification', () => {
        component.setState({ learnedRecipes: { 'sample-recipe-1': true } })
        component.update()

        expect(component.state().todaysNotifications).toContainEqual({
          message: RECIPE_LEARNED`${recipesMap['sample-recipe-1']}`,
          severity: 'info',
        })
      })
    })

    describe('two new recipes were learned', () => {
      test('does show notification', () => {
        const learnedRecipes = ['sample-recipe-1', 'sample-recipe-2'].map(
          id => recipesMap[id]
        )

        component.setState({
          learnedRecipes: { 'sample-recipe-1': true, 'sample-recipe-2': true },
        })
        component.update()

        expect(component.state().todaysNotifications).toContainEqual({
          message: RECIPES_LEARNED`${learnedRecipes}`,
          severity: 'info',
        })
      })
    })

    describe('three new recipes were learned', () => {
      test('does show notification', () => {
        const learnedRecipes = [
          'sample-recipe-1',
          'sample-recipe-2',
          'sample-recipe-3',
        ].map(id => recipesMap[id])

        component.setState({
          learnedRecipes: {
            'sample-recipe-1': true,
            'sample-recipe-2': true,
            'sample-recipe-3': true,
          },
        })
        component.update()

        expect(component.state().todaysNotifications).toContainEqual({
          message: RECIPES_LEARNED`${learnedRecipes}`,
          severity: 'info',
        })
      })
    })
  })

  describe('incrementDay', () => {
    beforeEach(() => {
      jest.spyOn(localforageMock, 'setItem')
      jest.spyOn(component.instance(), 'showNotification')
      jest.spyOn(Math, 'random').mockReturnValue(1)

      component.setState({
        newDayNotifications: [{ message: 'foo', severity: 'info' }],
      })
      component.instance().incrementDay()
    })

    test('empties out newDayNotifications', () => {
      expect(component.state().newDayNotifications).toHaveLength(0)
    })

    test('persists app state with pending newDayNotifications', () => {
      expect(localforageMock.setItem).toHaveBeenCalledWith(
        'state',
        reduceByPersistedKeys({
          ...component.state(),
          newDayNotifications: [
            { message: 'foo', severity: 'info' },
            {
              message: LOAN_BALANCE_NOTIFICATION`${
                component.state().loanBalance
              }`,
              severity: 'warning',
            },
          ],
        })
      )
    })

    test('makes pending notification', () => {
      const { showNotification } = component.instance()
      expect(showNotification).toHaveBeenCalledTimes(3)
      expect(showNotification).toHaveBeenNthCalledWith(1, 'foo', 'info')
    })
  })

  describe('focusNextView', () => {
    test('goes to next view', () => {
      const { viewList } = component.instance()
      component.setState({ stageFocus: viewList[0] })
      component.instance().focusNextView()
      expect(component.state().stageFocus).toEqual(viewList[1])
    })

    test('cycles to the beginning', () => {
      const { viewList } = component.instance()
      component.setState({ stageFocus: viewList[viewList.length - 1] })
      component.instance().focusNextView()
      expect(component.state().stageFocus).toEqual(viewList[0])
    })
  })

  describe('focusPreviousView', () => {
    test('goes to previous view', () => {
      const { viewList } = component.instance()
      component.setState({ stageFocus: viewList[1] })
      component.instance().focusPreviousView()
      expect(component.state().stageFocus).toEqual(viewList[0])
    })

    test('cycles to the end', () => {
      const { viewList } = component.instance()
      component.setState({ stageFocus: viewList[0] })
      component.instance().focusPreviousView()
      expect(component.state().stageFocus).toEqual(
        viewList[viewList.length - 1]
      )
    })
  })
})
