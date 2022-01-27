import React from 'react'
import { render, screen } from '@testing-library/react'

import { generateCow } from '../../utils'

import { CowPenContextMenu } from './CowPenContextMenu'

jest.mock('../Item', () => ({
  __esModule: true,
  default: () => <></>,
}))

describe('CowPenContextMenu', () => {
  let baseProps

  describe('cow selection', () => {
    let testCow

    beforeEach(() => {
      jest.spyOn(Math, 'random').mockReturnValue(0)

      baseProps = {
        cowBreedingPen: { cowId1: null, cowId2: null, daysUntilBirth: -1 },
        cowForSale: generateCow(),
        cowInventory: [],
        debounced: {},
        handleCowAutomaticHugChange: () => {},
        handleCowBreedChange: () => {},
        handleCowHugClick: () => {},
        handleCowNameInputChange: () => {},
        handleCowPurchaseClick: () => {},
        handleCowSelect: () => {},
        handleCowSellClick: () => {},
        inventory: [],
        money: 0,
        purchasedCowPen: 1,
        selectedCowId: '',
      }
      testCow = generateCow({ id: 'foo' })
    })

    describe('cow is not selected', () => {
      test('provides correct isSelected prop', () => {
        render(
          <CowPenContextMenu
            {...{
              ...baseProps,
              cowInventory: [testCow],
              selectedCowId: 'bar',
            }}
          />
        )

        const selectedText = screen.queryByText(/is currently selected/)
        expect(selectedText).toBeNull()
      })
    })

    describe('cow is selected', () => {
      test('provides correct isSelected prop', () => {
        render(
          <CowPenContextMenu
            {...{
              ...baseProps,
              cowInventory: [testCow],
              selectedCowId: 'foo',
            }}
          />
        )

        const selectedText = screen.queryByText(/is currently selected/)
        expect(selectedText).not.toBeNull()
      })
    })
  })
})
