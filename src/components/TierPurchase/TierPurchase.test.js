import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'

import { shallow } from 'enzyme'

import { TierPurchase } from './TierPurchase'

let component

beforeEach(() => {
  component = shallow(
    <TierPurchase
      {...{
        handleTierPurchase: () => {},
        money: 0,
        purchasedTier: 0,
        renderTierLabel: () => {},
        tiers: new Map([
          [1, { value: 'foo', price: 1000 }],
          [2, { value: 'bar', price: 2000 }],
          [3, { value: 'baz', price: 3000 }],
        ]),
        title: '',
      }}
    />
  )
})

test('renders', () => {
  expect(component).toHaveLength(1)
})

test('renders tiers', () => {
  expect(component.find(MenuItem)).toHaveLength(3)
})

describe('option rendering', () => {
  describe('user does not have enough money for tier', () => {
    test('tier is disabled', () => {
      expect(
        component
          .find(MenuItem)
          .first()
          .props().disabled
      ).toBeTruthy()
    })
  })

  describe('unpurchased tiers', () => {
    describe('user has enough money for tier', () => {
      test('tier is not disabled', () => {
        component.setProps({
          purchasedTier: 0,
          money: 1000,
        })

        expect(
          component
            .find(MenuItem)
            .first()
            .props().disabled
        ).toBeFalsy()
      })
    })
  })

  describe('purchased tiers', () => {
    test('tier is disabled', () => {
      component.setProps({
        purchasedTier: 1,
        money: Number.MAX_VALUE,
      })

      expect(
        component
          .find(MenuItem)
          .first()
          .props().disabled
      ).toBeTruthy()
    })
  })
})

describe('getters', () => {
  describe('canPlayerBuySelectedTier', () => {
    beforeEach(() => {
      component.setState({ selectedTier: '1' })
    })

    describe('player can not buy selected tier', () => {
      test('button is enabled', () => {
        expect(component.instance().canPlayerBuySelectedTier).toBeFalsy()
      })
    })

    describe('player can buy selected tier', () => {
      test('button is enabled', () => {
        component.setProps({
          purchasedTier: 0,
          money: 100000,
        })

        expect(component.instance().canPlayerBuySelectedTier).toBeTruthy()
      })
    })
  })
})

describe('handleTierPurchase', () => {
  let handleTierPurchase

  beforeEach(() => {
    handleTierPurchase = jest.fn()
    component.setProps({ handleTierPurchase })
    component.setState({ selectedTier: 2 })
  })

  describe('user does not have enough money', () => {
    test('does not call handleTierPurchase prop', () => {
      component.instance().handleTierPurchase()
      expect(handleTierPurchase).not.toHaveBeenCalled()
    })
  })

  describe('user has enough money', () => {
    test('does call handleTierPurchase prop', () => {
      component.setProps({ purchasedTier: 0, money: 2000 })
      component.instance().handleTierPurchase()
      expect(handleTierPurchase).toHaveBeenCalledWith(2)
    })
  })
})

describe('updateSelectedTier', () => {
  beforeEach(() => {
    component.setState({ selectedTier: '1' })
  })

  describe('player does not have enough money for next tier', () => {
    test('does not update selectedTier', () => {
      component.setProps({ purchasedTier: 1, money: 0 })
      component.instance().updateSelectedTier()

      expect(component.state().selectedTier).toEqual('1')
    })
  })

  describe('player has enough money for next tier', () => {
    test('updates selectedTier', () => {
      component.setProps({ purchasedTier: 1, money: 2000 })
      component.instance().updateSelectedTier()

      expect(component.state().selectedTier).toEqual('2')
    })
  })
})
