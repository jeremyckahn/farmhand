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
          showMaxOutButton: true,
        })
      })

      test('enables purchase buttons', () => {
        expect(component.find('.purchase').props().disabled).toEqual(false)
        expect(component.find('.max-out').props().disabled).toEqual(false)
      })
    })

    describe('user does not have enough money', () => {
      beforeEach(() => {
        component.setProps({
          money: 5,
          showMaxOutButton: true,
        })
      })

      test('disables purchase buttons', () => {
        expect(component.find('.purchase').props().disabled).toEqual(true)
        expect(component.find('.max-out').props().disabled).toEqual(true)
      })
    })
  })

  describe('isSellView', () => {
    beforeEach(() => {
      component.setProps({
        isSellView: true,
        item: testItem({ id: 'an-item' }),
      })
    })

    test('renders sell buttons', () => {
      expect(component.find('.sell')).toHaveLength(1)
      expect(component.find('.sell-all')).toHaveLength(1)
    })

    describe('inventory quantity', () => {
      describe('is 0', () => {
        test('buttons are disabled', () => {
          component.setProps({ playerInventoryQuantities: { 'an-item': 0 } })
          expect(component.find('.sell').props().disabled).toEqual(true)
          expect(component.find('.sell-all').props().disabled).toEqual(true)
        })
      })

      describe('is greater than 0', () => {
        test('buttons are enabled', () => {
          component.setProps({ playerInventoryQuantities: { 'an-item': 1 } })
          expect(component.find('.sell').props().disabled).toEqual(false)
          expect(component.find('.sell-all').props().disabled).toEqual(false)
        })
      })
    })
  })
})
