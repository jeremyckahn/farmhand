import React from 'react'
import { render, screen } from '@testing-library/react'

import { testItem } from '../../test-utils'

import { INFINITE_STORAGE_LIMIT } from '../../constants'

import { Item } from './Item'

jest.mock('../../data/maps')

describe('Item', () => {
  const baseProps = {
    completedAchievements: {},
    historicalValueAdjustments: [],
    inventory: [],
    inventoryLimit: INFINITE_STORAGE_LIMIT,
    item: testItem(),
    money: 0,
    playerInventoryQuantities: {},
    valueAdjustments: {},
    adjustedValue: 0,
    previousDayAdjustedValue: 0,
  }

  describe('static UI', () => {
    test('renders the name', () => {
      const itemName = 'Cool Item'
      render(<Item {...{ ...baseProps, item: testItem({ name: itemName }) }} />)
      expect(screen.getByText(itemName)).toBeInTheDocument()
    })
  })

  describe('conditional UI', () => {
    describe('class names', () => {
      test('supports is-selected', () => {
        const { container } = render(
          <Item {...{ ...baseProps, isSelected: true }} />
        )
        expect(container.firstChild).toHaveClass('is-selected')
      })
    })

    describe('isPurchaseView', () => {
      const props = {
        ...baseProps,
        isPurchaseView: true,
        adjustedValue: 10,
      }

      describe('user has enough money', () => {
        beforeEach(() => {
          render(<Item {...{ ...props, money: 20 }} />)
        })

        test('enables purchase buttons', () => {
          expect(screen.getByRole('button', { name: 'Buy' })).not.toBeDisabled()
        })
      })

      describe('user does not have enough money', () => {
        beforeEach(() => {
          render(<Item {...{ ...props, money: 5 }} />)
        })

        test('disables purchase buttons', () => {
          expect(screen.getByRole('button', { name: 'Buy' })).toBeDisabled()
        })
      })
    })

    describe('isSellView', () => {
      beforeEach(() => {
        const id = 'an-item'
        render(
          <Item
            {...{
              ...baseProps,
              isSellView: true,
              item: testItem({ id }),
              playerInventoryQuantities: { [id]: 1 },
            }}
          />
        )
      })

      test('renders sell buttons', () => {
        expect(screen.getByRole('button', { name: 'Sell' })).toBeInTheDocument()
      })
    })
  })
})
