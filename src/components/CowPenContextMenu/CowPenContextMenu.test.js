import React from 'react'
import { shallow } from 'enzyme'
import { render, screen } from '@testing-library/react'

import { generateCow } from '../../utils'
import { PURCHASEABLE_COW_PENS } from '../../constants'
import { cowColors } from '../../enums'

import {
  CowPenContextMenu,
  CowCard,
  CowCardSubheader,
} from './CowPenContextMenu'

jest.mock('../Item', () => ({
  __esModule: true,
  default: () => <></>,
}))

let component

describe('CowPenContextMenu', () => {
  const baseProps = {
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

  describe('cow selection', () => {
    describe('cow is not selected', () => {
      test('provides correct isSelected prop', () => {
        component = shallow(
          <CowPenContextMenu
            {...{
              ...baseProps,
              cowInventory: [generateCow({ id: 'foo' })],
              selectedCowId: 'bar',
            }}
          />
        )

        expect(
          component
            .find('.card-list')
            .find(CowCard)
            .props().isSelected
        ).toEqual(false)
      })
    })

    describe('cow is selected', () => {
      test('provides correct isSelected prop', () => {
        component = shallow(
          <CowPenContextMenu
            {...{
              ...baseProps,
              cowInventory: [generateCow({ id: 'foo' })],
              selectedCowId: 'foo',
            }}
          />
        )

        expect(
          component
            .find('.card-list')
            .find(CowCard)
            .props().isSelected
        ).toEqual(true)
      })
    })
  })
})

describe('CowCard', () => {
  const baseProps = {
    cow: generateCow({
      color: cowColors.WHITE,
      name: '',
      baseWeight: 100,
    }),
    cowInventory: [],
    cowBreedingPen: {
      cowId1: null,
      cowId2: null,
      daysUntilBirth: -1,
    },
    handleCowSelect: () => {},
    handleCowNameInputChange: () => {},
    handleCowPurchaseClick: () => {},
    isSelected: false,
    inventory: [],
    money: 0,
    purchasedCowPen: 1,
    selectedCowId: '',
  }

  describe('cow purchase button', () => {
    describe('player does not have enough money', () => {
      describe('cow pen has no space', () => {
        test('button is disabled', () => {
          const cowCapacity = PURCHASEABLE_COW_PENS.get(1).cows
          const testCow = generateCow({
            color: cowColors.WHITE,
            name: '',
            baseWeight: 100,
          })

          render(
            <CowCard
              {...{
                ...baseProps,
                cow: testCow,
                money: 0,
                cowInventory: Array(cowCapacity)
                  .fill(null)
                  .map(() => generateCow()),
              }}
            />
          )

          const button = screen.getByText('Buy').closest('button')

          expect(button).toHaveAttribute('disabled')
        })
      })

      describe('cow pen has space', () => {
        test('button is disabled', () => {
          const testCow = generateCow({
            color: cowColors.WHITE,
            name: '',
            baseWeight: 100,
          })

          render(
            <CowCard
              {...{
                ...baseProps,
                cow: testCow,
                money: 0,
              }}
            />
          )

          const button = screen.getByText('Buy').closest('button')

          expect(button).toHaveAttribute('disabled')
        })
      })
    })

    describe('player has enough money', () => {
      describe('cow pen has no space', () => {
        test('button is disabled', () => {
          const cowCapacity = PURCHASEABLE_COW_PENS.get(1).cows

          render(
            <CowCard
              {...{
                ...baseProps,
                money: 150,
                cowInventory: Array(cowCapacity)
                  .fill(null)
                  .map(() => generateCow()),
              }}
            />
          )

          const button = screen.getByText('Buy').closest('button')

          expect(button).toHaveAttribute('disabled')
        })
      })

      describe('cow pen has space', () => {
        test('button is not disabled', () => {
          render(<CowCard {...{ ...baseProps, money: 150 }} />)

          const button = screen.getByText('Buy').closest('button')

          expect(button).not.toHaveAttribute('disabled')
        })
      })
    })
  })
})

describe('CowCardSubheader', () => {
  const baseProps = {
    cow: generateCow({
      color: cowColors.WHITE,
      happiness: 0,
      name: '',
      baseWeight: 100,
    }),
    cowBreedingPen: { cowId1: null, cowId2: null, daysUntilBirth: -1 },
    cowValue: 1000,
    isCowPurchased: false,
  }

  describe('happiness display', () => {
    describe('cow is not purchased', () => {
      test('renders no hearts', () => {
        const { container } = render(<CowCardSubheader {...baseProps} />)

        expect(container.querySelector('.heart')).toBeNull()
      })
    })

    describe('cow is purchased', () => {
      test('renders hearts', () => {
        component = shallow(
          <CowCardSubheader {...{ ...baseProps, isCowPurchased: true }} />
        )

        expect(component.find('.heart')).toHaveLength(10)
      })

      test('renders full hearts that match cow happiness', () => {
        let { container } = render(
          <CowCardSubheader
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

        expect(container.querySelectorAll('.heart')).toHaveLength(10)
        expect(container.querySelectorAll('.heart.is-full')).toHaveLength(5)

        container = render(
          <CowCardSubheader
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
        ).container

        expect(container.querySelectorAll('.heart')).toHaveLength(10)
        expect(container.querySelectorAll('.heart.is-full')).toHaveLength(10)
      })
    })
  })
})
