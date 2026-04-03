import React from 'react'
import { render, screen } from '@testing-library/react'

import { generateCow } from '../../utils/index.js'
import { noop } from '../../utils/noop.js'

import { CowPenContextMenu } from './CowPenContextMenu.js'

vitest.mock('../CowCard', () => ({
  __esModule: true,
  default: () => <></>,
}))

vitest.mock('../Item', () => ({
  __esModule: true,
  default: () => <></>,
}))

describe('CowPenContextMenu', () => {
  let baseProps

  beforeEach(() => {
    baseProps = {
      cowBreedingPen: { cowId1: null, cowId2: null, daysUntilBirth: -1 },
      cowForSale: generateCow(),
      cowInventory: [],
      handleCowAutomaticHugChange: noop,
      handleCowBreedChange: noop,
      handleCowHugClick: noop,
      handleCowNameInputChange: noop,
      handleCowOfferClick: noop,
      handleCowSelect: noop,
      handleCowSellClick: noop,
      handleCowWithdrawClick: noop,
      purchasedCowPen: 1,
      selectedCowId: '',
    }
  })

  test('renders', () => {
    render(<CowPenContextMenu {...{ ...baseProps }} />)

    expect(screen.getByText('For sale')).toBeTruthy()
    expect(screen.getByText('Cows')).toBeTruthy()
    expect(screen.getByText('Breeding Pen')).toBeTruthy()
    expect(screen.getByText('Supplies')).toBeTruthy()
  })
})
