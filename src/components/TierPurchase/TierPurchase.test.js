import React from 'react'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TierPurchase } from './TierPurchase.js'

describe('<TierPurchase />', () => {
  let onBuyClick, props

  beforeEach(() => {
    onBuyClick = vitest.fn()
    props = {
      onBuyClick,
      money: 0,
      purchasedTier: 0,
      renderTierLabel: tier => tier.value,
      description: 'describe yourself',
      maxedOutPlaceholder: 'at max',
      tiers: new Map([
        [1, { value: 'foo', price: 1000 }],
        [2, { value: 'bar', price: 2000 }],
        [3, { value: 'baz', price: 3000 }],
      ]),
      title: 'Purchasable Item',
    }
  })

  const buyButton = () => screen.getByRole('button', { name: 'Buy' })

  // MUI doesn't give this button a name but clicking it is required to get the listbox to render
  const openSelect = () => userEvent.click(screen.getByRole('combobox'))

  describe('renders', () => {
    beforeEach(() => {
      render(<TierPurchase {...props} />)
    })

    test('contains the title', () => {
      expect(screen.getByText('Purchasable Item')).toBeInTheDocument()
    })

    test('it contains a buy button', () => {
      expect(buyButton()).toBeInTheDocument()
    })

    test('contains the tiers select', async () => {
      await openSelect()

      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    test('it contains the description', () => {
      expect(screen.getByText('describe yourself')).toBeInTheDocument()
    })
  })

  describe('tiers', () => {
    test('it contains an option for each tier', async () => {
      render(<TierPurchase {...props} />)
      await openSelect()

      expect(screen.getAllByRole('option')).toHaveLength(3)
    })

    test('it contains the maxed out placeholder when the highest tier has been purchased', () => {
      props.purchasedTier = 3

      render(<TierPurchase {...props} />)

      expect(screen.getByText('at max')).toBeInTheDocument()
    })

    test('it calls onBuyClick if the selected tier can be purchased', async () => {
      props.purchasedTier = 1
      props.money = 2000

      render(<TierPurchase {...props} />)
      await openSelect()
      await userEvent.click(screen.getByRole('option', { name: 'bar' }))
      await userEvent.click(buyButton())

      expect(onBuyClick).toHaveBeenCalledWith(2)
    })

    test('tiers that can be afforded can be selected', async () => {
      props.money = 2000

      render(<TierPurchase {...props} />)
      await openSelect()

      expect(screen.getByRole('option', { name: 'foo' })).not.toHaveAttribute(
        'aria-disabled'
      )
    })

    test('tiers that are too expensive cannot be selected', async () => {
      props.money = 2000

      render(<TierPurchase {...props} />)
      await openSelect()

      expect(screen.getByRole('option', { name: 'baz' })).toHaveAttribute(
        'aria-disabled',
        'true'
      )
    })

    test('tiers that that have already been purchased cannot be selected', async () => {
      props.money = 2000
      props.purchasedTier = 1

      render(<TierPurchase {...props} />)
      await openSelect()

      expect(screen.getByRole('option', { name: 'foo' })).toHaveAttribute(
        'aria-disabled',
        'true'
      )
    })

    test('it has the next available tier selected', async () => {
      props.money = 2000
      props.purchasedTier = 1

      render(<TierPurchase {...props} />)
      await openSelect()

      expect(screen.getByRole('option', { name: 'bar' })).toHaveAttribute(
        'aria-selected',
        'true'
      )
    })
  })
})
