import React from 'react'
import { shallow } from 'enzyme'

import {
  sampleItem1,
  sampleItem2,
  sampleFieldTool1,
  sampleCropSeedsItem1,
} from './data/items'
import { testItem } from './test-utils'
import {
  INITIAL_FIELD_WIDTH,
  INITIAL_FIELD_HEIGHT,
  PURCHASEABLE_COW_PENS,
} from './constants'
import {
  COW_PEN_PURCHASED,
  LOAN_BALANCE_NOTIFICATION,
  RECIPE_LEARNED,
} from './templates'
import { reduceByPersistedKeys } from './utils'
import { PROGRESS_SAVED_MESSAGE } from './strings'
import { stageFocusType } from './enums'
import { recipesMap } from './data/maps'
import Farmhand, {
  computePlayerInventory,
  getFieldToolInventory,
  getPlantableCropInventory,
} from './Farmhand'

jest.mock('localforage')
jest.mock('./data/maps')
jest.mock('./data/items')
jest.mock('./data/levels', () => ({ levels: [] }))
jest.mock('./data/shop-inventory')

jest.mock('./data/achievements', () => [])

jest.mock('./constants', () => ({
  __esModule: true,
  ...jest.requireActual('./constants'),
  COW_HUG_BENEFIT: 0.5,
  CROW_CHANCE: 0,
  INITIAL_FIELD_HEIGHT: 4,
  INITIAL_FIELD_WIDTH: 4,
  PRECIPITATION_CHANCE: 0,
}))

const { objectContaining } = expect

let component

const stubLocalforage = () => {
  const localforage = jest.requireMock('localforage')
  localforage.createInstance = () => ({
    getItem: () => Promise.resolve(null),
    setItem: (_key, data) => Promise.resolve(data),
  })
}

beforeEach(() => {
  stubLocalforage()
  component = shallow(<Farmhand {...{ match: { path: '', params: {} } }} />)
})

describe('private helpers', () => {
  describe('computePlayerInventory', () => {
    let playerInventory
    let inventory
    let valueAdjustments

    beforeEach(() => {
      inventory = [{ quantity: 1, id: 'sample-item-1' }]
      valueAdjustments = {}
      playerInventory = computePlayerInventory(inventory, valueAdjustments)
    })

    test('maps inventory state to renderable inventory data', () => {
      expect(playerInventory).toEqual([{ quantity: 1, ...sampleItem1 }])
    })

    test('returns cached result with unchanged input', () => {
      const newPlayerInventory = computePlayerInventory(
        inventory,
        valueAdjustments
      )
      expect(playerInventory).toEqual(newPlayerInventory)
    })

    test('invalidates cache with changed input', () => {
      playerInventory = computePlayerInventory(
        [{ quantity: 1, id: 'sample-item-2' }],
        valueAdjustments
      )
      expect(playerInventory).toEqual([{ ...sampleItem2, quantity: 1 }])
    })

    describe('with valueAdjustments', () => {
      beforeEach(() => {
        valueAdjustments = {
          'sample-item-1': 2,
        }

        playerInventory = computePlayerInventory(inventory, valueAdjustments)
      })

      test('maps inventory state to renderable inventory data', () => {
        expect(playerInventory).toEqual([
          { ...sampleItem1, quantity: 1, value: 2 },
        ])
      })
    })
  })

  describe('getFieldToolInventory', () => {
    let fieldToolInventory

    beforeEach(() => {
      fieldToolInventory = getFieldToolInventory([
        sampleFieldTool1,
        sampleCropSeedsItem1,
      ])
    })

    test('filters out non-field tool items', () => {
      expect(fieldToolInventory).toEqual([sampleFieldTool1])
    })
  })

  describe('getPlantableCropInventory', () => {
    let plantableCropInventory
    let inventory

    beforeEach(() => {
      inventory = [{ id: 'sample-crop-seeds-1' }, { id: 'sample-item-1' }]
      plantableCropInventory = getPlantableCropInventory(inventory)
    })

    test('filters out non-plantable items', () => {
      expect(plantableCropInventory).toEqual([sampleCropSeedsItem1])
    })
  })
})

describe('state', () => {
  test('inits field', () => {
    expect(component.state().field).toHaveLength(INITIAL_FIELD_HEIGHT)
    expect(component.state().field[0]).toHaveLength(INITIAL_FIELD_WIDTH)
  })

  test('changing to state.stageFocus === stageFocusType.COW_PEN resets selectedCowId', () => {
    component.setState({
      selectedCowId: 'foo',
      stageFocus: stageFocusType.FIELD,
    })

    component.setState({ stageFocus: stageFocusType.COW_PEN })

    expect(component.state().selectedCowId).toEqual('')
  })
})

describe('getters', () => {
  describe('playerInventoryQuantities', () => {
    test('computes a map of item IDs to their quantity in the inventory', () => {
      component.setState({
        inventory: [
          testItem({ id: 'sample-item-1', quantity: 1 }),
          testItem({ id: 'sample-item-2', quantity: 2 }),
        ],
      })

      expect(component.instance().playerInventoryQuantities).toEqual(
        objectContaining({
          'sample-item-1': 1,
          'sample-item-2': 2,
          'sample-item-3': 0,
        })
      )
    })
  })
})

describe('instance methods', () => {
  describe('componentDidMount', () => {
    beforeEach(() => {
      jest.spyOn(component.instance(), 'incrementDay')
    })

    describe('fresh boot', () => {
      beforeEach(() => {
        component.instance().componentDidMount()
      })

      test('increments the day by one', () => {
        expect(component.instance().incrementDay).toHaveBeenCalled()
      })
    })

    describe('boot from persisted state', () => {
      beforeEach(() => {
        const localforage = jest.requireMock('localforage')
        localforage.createInstance = () => ({
          getItem: () =>
            Promise.resolve({
              foo: 'bar',
              newDayNotifications: [{ message: 'baz', severity: 'info' }],
            }),
          setItem: data => Promise.resolve(data),
        })

        component = shallow(
          <Farmhand {...{ match: { path: '', params: {} } }} />
        )

        jest.spyOn(component.instance(), 'incrementDay')
        jest.spyOn(component.instance(), 'showNotification')

        component.instance().componentDidMount()
      })

      test('rehydrates from persisted state', () => {
        expect(component.instance().incrementDay).not.toHaveBeenCalled()
        expect(component.state().foo).toBe('bar')
      })

      test('shows notifications for pending newDayNotifications', () => {
        expect(component.instance().showNotification).toHaveBeenCalledWith(
          'baz',
          'info'
        )
      })

      test('empties newDayNotifications', () => {
        expect(component.state().newDayNotifications).toHaveLength(0)
      })
    })
  })

  describe('showCowPenPurchasedNotifications', () => {
    describe('cow pen purchasing', () => {
      test('does show notification', () => {
        component.setState({ purchasedCowPen: 1 })
        component
          .instance()
          .showCowPenPurchasedNotifications({ purchasedCowPen: 0 })

        expect(component.state().notifications).toContainEqual({
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
        component
          .instance()
          .showRecipeLearnedNotifications({ learnedRecipes: {} })

        expect(component.state().notifications).not.toContainEqual({
          message: RECIPE_LEARNED`${recipesMap['sample-recipe-1']}`,
          severity: 'info',
        })
      })
    })

    describe('new recipe was learned', () => {
      test('does show notification', () => {
        component.setState({ learnedRecipes: { 'sample-recipe-1': true } })
        component
          .instance()
          .showRecipeLearnedNotifications({ learnedRecipes: {} })

        expect(component.state().notifications).toContainEqual({
          message: RECIPE_LEARNED`${recipesMap['sample-recipe-1']}`,
          severity: 'info',
        })
      })
    })
  })

  describe('incrementDay', () => {
    beforeEach(() => {
      jest.spyOn(component.instance().localforage, 'setItem')
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
      expect(component.instance().localforage.setItem).toHaveBeenCalledWith(
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
      expect(showNotification).toHaveBeenNthCalledWith(
        2,
        LOAN_BALANCE_NOTIFICATION`${component.state().loanBalance}`,
        'warning'
      )
      expect(showNotification).toHaveBeenNthCalledWith(
        3,
        PROGRESS_SAVED_MESSAGE,
        'info'
      )
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
