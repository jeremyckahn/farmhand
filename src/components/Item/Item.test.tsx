import React from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { testItem } from '../../test-utils/index.js'
import { season } from '../../enums.js'
import { carrotSeed } from '../../data/crops/index.js'

import { INFINITE_STORAGE_LIMIT } from '../../constants.js'

import { Item } from './Item.js'

vitest.mock('../../data/maps.js')

describe('Item', () => {
  const baseProps = {
    completedAchievements: {},
    dayCount: 0,
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
        adjustedValue: 10.42,
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

      describe('prices', () => {
        beforeEach(() => {
          render(<Item {...{ ...props, money: 100 }} />)
        })

        test('displays item price', () => {
          const buyPrice = screen.getByText('Price:')

          expect(within(buyPrice).getByText('$10.42')).toBeInTheDocument()
        })

        test('displays total price', async () => {
          const increment = screen.getByRole('button', { name: 'Increment' })

          await userEvent.click(increment)
          const total = screen.getByText('Total:')

          await waitFor(() =>
            expect(within(total).getByText('$20.84')).toBeInTheDocument()
          )
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
              adjustedValue: 10.42,
              item: testItem({ id }),
              playerInventoryQuantities: { [id]: 4 },
            }}
          />
        )
      })

      test('renders sell buttons', () => {
        expect(screen.getByRole('button', { name: 'Sell' })).toBeInTheDocument()
      })

      describe('prices', () => {
        test('displays item price', () => {
          const sellPrice = screen.getByText('Sell price:')

          expect(within(sellPrice).getByText('$10.42')).toBeInTheDocument()
        })

        test('displays total price', async () => {
          const increment = screen.getByRole('button', { name: 'Increment' })

          await userEvent.click(increment)
          await userEvent.click(increment)
          await userEvent.click(increment)
          const total = screen.getByText('Total:')

          await waitFor(() =>
            expect(within(total).getByText('$41.68')).toBeInTheDocument()
          )
        })
      })

      describe('seasonal demand indicator', () => {
        test('shows In Season, styled with success-text, during a high demand season', () => {
          const id = 'high-demand-item'

          render(
            <Item
              {...{
                ...baseProps,
                dayCount: 0,
                isSellView: true,
                item: testItem({ id, highDemandSeasons: [season.SPRING] }),
                playerInventoryQuantities: { [id]: 4 },
              }}
            />
          )

          expect(screen.getByText('In Season')).toHaveClass('success-text')
        })

        test('shows Out of Season, styled with danger-text, during a low demand season', () => {
          const id = 'low-demand-item'

          render(
            <Item
              {...{
                ...baseProps,
                dayCount: 0,
                isSellView: true,
                item: testItem({ id, lowDemandSeasons: [season.SPRING] }),
                playerInventoryQuantities: { [id]: 4 },
              }}
            />
          )

          expect(screen.getByText('Out of Season')).toHaveClass('danger-text')
        })

        test('shows no indicator outside of configured demand seasons', () => {
          const id = 'neutral-item'

          render(
            <Item
              {...{
                ...baseProps,
                dayCount: 0,
                isSellView: true,
                item: testItem({ id, highDemandSeasons: [season.SUMMER] }),
                playerInventoryQuantities: { [id]: 4 },
              }}
            />
          )

          expect(screen.queryByText('In Season')).not.toBeInTheDocument()
          expect(screen.queryByText('Out of Season')).not.toBeInTheDocument()
        })

        test('shows no indicator for a seed sold in the shop, even during its high demand season', () => {
          // dayCount 0 is SPRING, carrotSeed's configured high demand season,
          // but the seasonal price bonus never applies to shop-sold items
          // (see the #140 guard), so the label must not appear either.
          render(
            <Item
              {...{
                ...baseProps,
                dayCount: 0,
                isSellView: true,
                item: carrotSeed,
                playerInventoryQuantities: { [carrotSeed.id]: 4 },
              }}
            />
          )

          expect(screen.queryByText('In Season')).not.toBeInTheDocument()
          expect(screen.queryByText('Out of Season')).not.toBeInTheDocument()
        })
      })
    })
  })
})
