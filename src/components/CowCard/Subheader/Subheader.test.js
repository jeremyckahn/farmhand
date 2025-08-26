import React from 'react'
import { render, screen } from '@testing-library/react'

import { getCowStub } from '../../../test-utils/stubs/cowStub.js'
import { moneyString } from '../../../utils/moneyString.js'

import Subheader from './Subheader.js'

const COW_VALUE = 1000

describe('Subheader', () => {
  let baseProps

  beforeEach(() => {
    vitest.spyOn(Math, 'random').mockReturnValue(0)
    baseProps = {
      canCowBeTradedFor: false,
      cow: getCowStub(),
      cowBreedingPen: { cowId1: null, cowId2: null, daysUntilBirth: -1 },
      cowIdOfferedForTrade: '',
      cowInventory: [],
      cowValue: COW_VALUE,
      huggingMachinesRemain: false,
      playerId: '',
      isCowPurchased: false,
    }
  })

  describe('happiness display', () => {
    describe('cow is not purchased', () => {
      test('renders no hearts', () => {
        const { container } = render(<Subheader {...baseProps} />)

        expect(container.querySelector('.heart')).toBeNull()
      })
    })

    describe('cow is purchased', () => {
      test('renders hearts', () => {
        const { container } = render(
          <Subheader {...{ ...baseProps, isCowPurchased: true }} />
        )

        expect(container.querySelectorAll('.heart')).toHaveLength(10)
      })

      test('renders partial full hearts', () => {
        let { container } = render(
          <Subheader
            {...{
              ...baseProps,
              cow: getCowStub({
                happiness: 0.5,
              }),
              isCowPurchased: true,
            }}
          />
        )

        expect(container.querySelectorAll('.heart.is-full')).toHaveLength(5)
      })

      test('renders complete full hearts', () => {
        let { container } = render(
          <Subheader
            {...{
              ...baseProps,
              cow: getCowStub({
                happiness: 1,
              }),
              isCowPurchased: true,
            }}
          />
        )

        expect(container.querySelectorAll('.heart.is-full')).toHaveLength(10)
      })
    })
  })

  describe('price/value display', () => {
    test('displays price for cows that can be purchased', () => {
      render(
        <Subheader {...baseProps} cow={getCowStub({ originalOwnerId: '' })} />
      )

      const price = screen.getByText(`Price: ${moneyString(COW_VALUE)}`)
      expect(price).toBeInTheDocument()
    })

    test('displays value for cows that have been purchased', () => {
      render(
        <Subheader
          {...baseProps}
          cow={getCowStub({ originalOwnerId: 'abc123' })}
        />
      )

      const value = screen.getByText(`Value: ${moneyString(COW_VALUE)}`)
      expect(value).toBeInTheDocument()
    })
  })

  describe('cow age display', () => {
    const ageRegex = /days? old/
    test('displays when purchased', () => {
      render(<Subheader {...baseProps} isCowPurchased={true} />)

      const age = screen.queryByText(ageRegex)
      expect(age).not.toBeNull()
    })

    test('displays when offered as trade', () => {
      render(
        <Subheader
          {...baseProps}
          cowIdOfferedForTrade="1234"
          isCowPurchased={false}
        />
      )

      const age = screen.queryByText(ageRegex)
      expect(age).not.toBeNull()
    })

    test('hidden when unpurchased from shop', () => {
      render(<Subheader {...baseProps} isCowPurchased={false} />)

      const age = screen.queryByText(ageRegex)
      expect(age).toBeNull()
    })
  })
})
