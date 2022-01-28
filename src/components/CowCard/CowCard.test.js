import React from 'react'
import { render, screen } from '@testing-library/react'

import { generateCow } from '../../utils'
import { PURCHASEABLE_COW_PENS } from '../../constants'
import { cowColors, genders } from '../../enums'

import CowCard from './CowCard'

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
    isOnline: false,
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

  describe('breeding checkbox', () => {
    test('is enabled when pen is empty', () => {
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
            cowInventory: [testCow],
            money: 0,
            handleCowSellClick: () => {},
          }}
        />
      )

      const button = screen
        .getByText('Breed')
        .closest('label')
        .querySelector('[type=checkbox]')
      expect(button).not.toHaveAttribute('disabled')
    })

    test('is enabled when pen has space and compatible partner', () => {
      const testCow = generateCow({
        color: cowColors.WHITE,
        name: '',
        baseWeight: 100,
        gender: genders.FEMALE,
      })
      const breedingCow1 = generateCow({
        color: cowColors.WHITE,
        name: '',
        baseWeight: 100,
        gender: genders.MALE,
      })

      render(
        <CowCard
          {...{
            ...baseProps,
            cow: testCow,
            cowInventory: [testCow, breedingCow1],
            cowBreedingPen: {
              cowId1: breedingCow1.id,
              cowId2: null,
              daysUntilBirth: -1,
            },
            money: 0,
            handleCowSellClick: () => {},
          }}
        />
      )

      const button = screen
        .getByText('Breed')
        .closest('label')
        .querySelector('[type=checkbox]')
      expect(button).not.toHaveAttribute('disabled')
    })

    test('is enabled when cow is in the breeding pen', () => {
      const breedingCow1 = generateCow({
        color: cowColors.WHITE,
        name: '',
        baseWeight: 100,
        gender: genders.MALE,
      })
      const breedingCow2 = generateCow({
        color: cowColors.WHITE,
        name: '',
        baseWeight: 100,
        gender: genders.FEMALE,
      })

      render(
        <CowCard
          {...{
            ...baseProps,
            cow: breedingCow1,
            cowInventory: [breedingCow1, breedingCow2],
            cowBreedingPen: {
              cowId1: breedingCow1.id,
              cowId2: breedingCow2.id,
              daysUntilBirth: -1,
            },
            money: 0,
            handleCowSellClick: () => {},
          }}
        />
      )

      const button = screen
        .getByText('Breed')
        .closest('label')
        .querySelector('[type=checkbox]')
      expect(button).not.toHaveAttribute('disabled')
    })

    test('is disabled when pen has space and incompatible partner', () => {
      const testCow = generateCow({
        color: cowColors.WHITE,
        name: '',
        baseWeight: 100,
        gender: genders.FEMALE,
      })
      const breedingCow1 = generateCow({
        color: cowColors.WHITE,
        name: '',
        baseWeight: 100,
        gender: genders.FEMALE,
      })

      render(
        <CowCard
          {...{
            ...baseProps,
            cow: testCow,
            cowInventory: [testCow, breedingCow1],
            cowBreedingPen: {
              cowId1: breedingCow1.id,
              cowId2: null,
              daysUntilBirth: -1,
            },
            money: 0,
            handleCowSellClick: () => {},
          }}
        />
      )

      const button = screen
        .getByText('Breed')
        .closest('label')
        .querySelector('[type=checkbox]')
      expect(button).toHaveAttribute('disabled')
    })

    test('is disabled when pen is full', () => {
      const testCow = generateCow({
        color: cowColors.WHITE,
        name: '',
        baseWeight: 100,
      })
      const breedingCow1 = generateCow({
        color: cowColors.WHITE,
        name: '',
        baseWeight: 100,
        gender: genders.MALE,
      })
      const breedingCow2 = generateCow({
        color: cowColors.WHITE,
        name: '',
        baseWeight: 100,
        gender: genders.FEMALE,
      })

      render(
        <CowCard
          {...{
            ...baseProps,
            cow: testCow,
            cowInventory: [testCow, breedingCow1, breedingCow2],
            cowBreedingPen: {
              cowId1: breedingCow1.id,
              cowId2: breedingCow2.id,
              daysUntilBirth: -1,
            },
            money: 0,
            handleCowSellClick: () => {},
          }}
        />
      )

      const button = screen
        .getByText('Breed')
        .closest('label')
        .querySelector('[type=checkbox]')
      expect(button).toHaveAttribute('disabled')
    })
  })
})
