import React from 'react'
import CardHeader from '@material-ui/core/CardHeader'
import { shallow } from 'enzyme'

import { testItem } from '../../test-utils'

import { Item } from './Item'

jest.mock('../../data/maps')
jest.mock('../../data/shop-inventory')

let component

beforeEach(() => {
  component = shallow(
    <Item
      {...{
        completedAchievements: {},
        inventory: [],
        inventoryLimit: -1,
        item: testItem({ name: '' }),
        money: 0,
        playerInventoryQuantities: {},
        valueAdjustments: {},
        adjustedValue: 0,
      }}
    />
  )
})

describe('static UI', () => {
  beforeEach(() => {
    component.setProps({ item: testItem({ name: 'an-item' }) })
  })

  test('renders the name', () => {
    expect(component.find(CardHeader).props().title).toEqual('an-item')
  })
})

describe('conditional UI', () => {
  describe('class names', () => {
    beforeEach(() => {
      component.setProps({ isSelected: true })
    })

    test('supports is-selected', () => {
      expect(component.hasClass('is-selected')).toBeTruthy()
    })
  })

  describe('isPurchaseView', () => {
    beforeEach(() => {
      component.setProps({
        isPurchaseView: true,
        item: testItem({ name: 'an-item' }),
        adjustedValue: 10,
      })
    })

    describe('user has enough money', () => {
      beforeEach(() => {
        component.setProps({
          money: 20,
        })
      })

      test('enables purchase buttons', () => {
        expect(component.find('.purchase').props().disabled).toEqual(false)
      })
    })

    describe('user does not have enough money', () => {
      beforeEach(() => {
        component.setProps({
          money: 5,
        })
      })

      test('disables purchase buttons', () => {
        expect(component.find('.purchase').props().disabled).toEqual(true)
      })
    })
  })

  describe('isSellView', () => {
    beforeEach(() => {
      component.setProps({
        isSellView: true,
        item: testItem({ id: 'an-item' }),
        playerInventoryQuantities: {
          'an-item': 1,
        },
      })
    })

    test('renders sell buttons', () => {
      expect(component.find('.sell')).toHaveLength(1)
    })
  })
})
