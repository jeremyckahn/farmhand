import React from 'react'
import { shallow } from 'enzyme'

import Farmhand from '../components/Farmhand'
import { stageFocusType, fieldMode } from '../enums'
import { testItem } from '../test-utils'

jest.mock('../data/items')
jest.mock('../data/levels', () => ({
  levels: [
    {
      playerId: 0,
    },
    {
      playerId: 1,
      unlocksShopItem: 'sample-crop-seeds-1',
    },
  ],
  itemUnlockLevels: {},
}))
jest.mock('../data/recipes')
jest.mock('../data/shop-inventory')

let component

const handlers = () => component.instance().handlers

beforeEach(() => {
  component = shallow(<Farmhand />)
})

describe('handleFieldModeSelect', () => {
  beforeEach(() => {
    component.setState({
      selectedItemId: 'sample-crop-3',
    })
  })

  describe('fieldMode === PLANT', () => {
    beforeEach(() => {
      handlers().handleFieldModeSelect(fieldMode.PLANT)
    })

    test('updates fieldMode state', () => {
      expect(component.state().fieldMode).toEqual(fieldMode.PLANT)
    })

    test('does not change state.selectedItemId', () => {
      expect(component.state().selectedItemId).toEqual('sample-crop-3')
    })
  })

  describe('fieldMode !== PLANT', () => {
    beforeEach(() => {
      handlers().handleFieldModeSelect(fieldMode.WATER)
    })

    test('updates fieldMode state', () => {
      expect(component.state().fieldMode).toEqual(fieldMode.WATER)
    })

    test('resets state.selectedItemId', () => {
      expect(component.state().selectedItemId).toEqual('')
    })
  })
})

describe('handleItemSelectClick', () => {
  beforeEach(() => {
    component.setState({
      selectedItemId: 'sample-crop-1',
    })

    handlers().handleItemSelectClick(
      testItem({ enablesFieldMode: 'FOO', playerId: 'field-tool' })
    )
  })

  test('resets state.selectedItemId', () => {
    expect(component.state().selectedItemId).toEqual('field-tool')
  })

  test('sets state.fieldMode', () => {
    expect(component.state().fieldMode).toEqual('FOO')
  })
})

describe('handleClickEndDayButton', () => {
  test('increments the day', () => {
    jest.spyOn(component.instance(), 'incrementDay')
    handlers().handleClickEndDayButton()
    expect(component.instance().incrementDay).toHaveBeenCalled()
  })
})

describe('handleMenuToggle', () => {
  test('toggle menu state', () => {
    const { isMenuOpen } = component.state()
    handlers().handleMenuToggle()
    expect(component.state().isMenuOpen).toEqual(!isMenuOpen)
  })
})

describe('handleClickNextMenuButton', () => {
  test('calls focusNextView', () => {
    jest.spyOn(component.instance(), 'focusNextView').mockImplementation()
    handlers().handleClickNextMenuButton()
    expect(component.instance().focusNextView).toHaveBeenCalled()
  })
})

describe('handleClickPreviousMenuButton', () => {
  test('calls focusPreviousView', () => {
    jest.spyOn(component.instance(), 'focusPreviousView').mockImplementation()
    handlers().handleClickPreviousMenuButton()
    expect(component.instance().focusPreviousView).toHaveBeenCalled()
  })
})

describe('handleCowSelect', () => {
  test('calls selectCow', () => {
    jest.spyOn(component.instance(), 'selectCow').mockImplementation()
    handlers().handleCowSelect({ playerId: 'abc' })
    expect(component.instance().selectCow).toHaveBeenCalledWith({ playerId: 'abc' })
  })
})

describe('handleShowHomeScreenChange', () => {
  test('change show home screen setting to False while on Home and navigate to the next view', () => {
    component.setState({
      stageFocus: stageFocusType.HOME,
      showHomeScreen: true,
    })

    handlers().handleShowHomeScreenChange(null, false)
    expect(component.state().showHomeScreen).toBeFalse()
    expect(component.state().stageFocus).not.toEqual(stageFocusType.HOME)
  })

  test('change show home screen setting to False while not on Home and do not navigate', () => {
    component.setState({
      stageFocus: stageFocusType.SHOP,
      showHomeScreen: true,
    })

    handlers().handleShowHomeScreenChange(null, false)
    expect(component.state().showHomeScreen).toBeFalse()
    expect(component.state().stageFocus).toEqual(stageFocusType.SHOP)
  })

  test('change show home screen setting to True while on Home and do not navigate', () => {
    component.setState({
      stageFocus: stageFocusType.HOME,
      showHomeScreen: false,
    })

    handlers().handleShowHomeScreenChange(null, true)
    expect(component.state().showHomeScreen).toBeTrue()
    expect(component.state().stageFocus).toEqual(stageFocusType.HOME)
  })

  test('change show home screen setting to True while not on Home and do not navigate', () => {
    component.setState({
      stageFocus: stageFocusType.SHOP,
      showHomeScreen: false,
    })

    handlers().handleShowHomeScreenChange(null, true)
    expect(component.state().showHomeScreen).toBeTrue()
    expect(component.state().stageFocus).toEqual(stageFocusType.SHOP)
  })
})
