import React from 'react'
import { render } from '@testing-library/react'

import { generateCow } from '../../../utils'
import { cowColors } from '../../../enums'

import Subheader from './Subheader'

describe('Subheader', () => {
  let baseProps

  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0)
    baseProps = {
      canCowBeTradedFor: false,
      cow: generateCow({
        color: cowColors.WHITE,
        happiness: 0,
        name: '',
        baseWeight: 100,
      }),
      cowBreedingPen: { cowId1: null, cowId2: null, daysUntilBirth: -1 },
      cowIdOfferedForTrade: '',
      cowInventory: [],
      cowValue: 1000,
      huggingMachinesRemain: false,
      id: '',
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
              cow: generateCow({
                color: cowColors.WHITE,
                happiness: 0.5,
                name: '',
                baseWeight: 100,
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
              cow: generateCow({
                color: cowColors.WHITE,
                happiness: 1,
                name: '',
                baseWeight: 100,
              }),
              isCowPurchased: true,
            }}
          />
        )

        expect(container.querySelectorAll('.heart.is-full')).toHaveLength(10)
      })
    })
  })
})
