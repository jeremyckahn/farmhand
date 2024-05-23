/**
 * @typedef {import('../Farmhand/Farmhand').farmhand.state} farmhand.state
 * @typedef {import('./WineRecipe').WineRecipeProps} WineRecipeProps
 */

import React from 'react'
import { render, screen } from '@testing-library/react'

// eslint-disable-next-line no-unused-vars
import uiHandlers from '../../handlers/ui-events'
import FarmhandContext from '../Farmhand/Farmhand.context'
import { wineService } from '../../services/wine'

import {
  grapeChardonnay,
  grapeNebbiolo,
  grapeSauvignonBlanc,
} from '../../data/crops'
import { yeast } from '../../data/recipes'
import { GRAPES_REQUIRED_FOR_WINE } from '../../constants'
import { integerString } from '../../utils'
import { getYeastRequiredForWine } from '../../utils/getYeastRequiredForWine'

import { getKegStub } from '../../test-utils/stubs/getKegStub'

import { WineRecipe } from './WineRecipe'

/** @type {Pick<farmhand.state, 'cellarInventory' | 'inventory' | 'purchasedCellar'>} */
const stubGameState = {
  cellarInventory: [],
  inventory: [{ id: grapeChardonnay.id, quantity: 1 }],
  purchasedCellar: 1,
}

/** @type {Pick<uiHandlers, 'handleMakeWineClick'>} */
const stubHandlers = {
  handleMakeWineClick: jest.fn(),
}

/**
 * @param {Partial<{
 *   props: Partial<WineRecipeProps>,
 *   state: Partial<typeof stubGameState>,
 *   handlers: Partial<typeof stubHandlers>
 * }>} props
 */
const WineRecipeStub = (
  { props, state, handlers } = {
    props: { wineVariety: grapeChardonnay.variety },
    state: stubGameState,
    handlers: stubHandlers,
  }
) => {
  return (
    <FarmhandContext.Provider
      value={{
        // @ts-expect-error
        gameState: { ...stubGameState, ...state },
        // @ts-expect-error
        handlers: { ...stubHandlers, ...handlers },
      }}
    >
      <WineRecipe wineVariety={grapeChardonnay.variety} {...props} />
    </FarmhandContext.Provider>
  )
}

describe('WineRecipe', () => {
  test.each([
    {
      grape: grapeChardonnay,
      daysToMature: wineService.getDaysToMature(grapeChardonnay.variety),
    },
    {
      grape: grapeSauvignonBlanc,
      daysToMature: wineService.getDaysToMature(grapeSauvignonBlanc.variety),
    },
    {
      grape: grapeNebbiolo,
      daysToMature: wineService.getDaysToMature(grapeNebbiolo.variety),
    },
  ])(
    'shows $daysToMature days to mature for $grape.id',
    ({ grape, daysToMature }) => {
      render(
        <WineRecipeStub
          props={{ wineVariety: grape.variety }}
          state={{ inventory: [{ id: grape.id, quantity: 1 }] }}
        />
      )

      const label = screen.getByText(`Days to mature: ${daysToMature}`)

      expect(label).toBeInTheDocument()
    }
  )

  test.each([
    {
      grape: grapeChardonnay,
      quantity: 1,
    },
    {
      grape: grapeSauvignonBlanc,
      quantity: 10,
    },
    {
      grape: grapeNebbiolo,
      quantity: 100000,
    },
  ])('shows grape requirements for $grape.wineId', ({ grape, quantity }) => {
    render(
      <WineRecipeStub
        props={{ wineVariety: grape.variety }}
        state={{ inventory: [{ id: grape.id, quantity }] }}
      />
    )

    const label = screen.getByText(
      `Units of ${grape.name} required: ${integerString(
        GRAPES_REQUIRED_FOR_WINE
      )} (available: ${integerString(quantity)})`
    )

    expect(label).toBeInTheDocument()
  })

  test.each([
    {
      grape: grapeChardonnay,
      quantity: 1,
    },
    {
      grape: grapeSauvignonBlanc,
      quantity: 10,
    },
    {
      grape: grapeNebbiolo,
      quantity: 100000,
    },
  ])('shows yeast requirements for $grape.wineId', ({ grape, quantity }) => {
    render(
      <WineRecipeStub
        props={{ wineVariety: grape.variety }}
        state={{
          inventory: [
            { id: grape.id, quantity: 1 },
            { id: yeast.id, quantity },
          ],
        }}
      />
    )

    const label = screen.getByText(
      `Units of ${yeast.name} required: ${integerString(
        getYeastRequiredForWine(grape.variety)
      )} (available: ${integerString(quantity)})`
    )

    expect(label).toBeInTheDocument()
  })

  test.each([
    {
      grape: grapeChardonnay,
      quantity: 0,
    },
    {
      grape: grapeSauvignonBlanc,
      quantity: 1,
    },
    {
      grape: grapeNebbiolo,
      quantity: 10,
    },
  ])(
    'shows that there are already $quantity units of $grape.wineId in cellar',
    ({ grape, quantity }) => {
      render(
        <WineRecipeStub
          props={{ wineVariety: grape.variety }}
          state={{
            cellarInventory: new Array(quantity).fill(
              getKegStub({ itemId: grape.wineId })
            ),
          }}
        />
      )

      const label = screen.getByText(`In cellar: ${integerString(quantity)}`)

      expect(label).toBeInTheDocument()
    }
  )

  test.each([
    { grape: grapeChardonnay, grapeQuantity: 0, yeastQuantity: 0 },
    {
      grape: grapeChardonnay,
      grapeQuantity: GRAPES_REQUIRED_FOR_WINE - 1,
      yeastQuantity: getYeastRequiredForWine(grapeChardonnay.variety),
    },
    {
      grape: grapeChardonnay,
      grapeQuantity: GRAPES_REQUIRED_FOR_WINE,
      yeastQuantity: getYeastRequiredForWine(grapeChardonnay.variety) - 1,
    },
  ])(
    'disables "Make" button when there are insufficient ingredients ($grape.id: $grapeQuantity, yeast: $yeastQuantity)',
    ({ grape, grapeQuantity, yeastQuantity }) => {
      render(
        <WineRecipeStub
          props={{ wineVariety: grape.variety }}
          state={{
            inventory: [
              { id: grape.id, quantity: grapeQuantity },
              { id: yeast.id, quantity: yeastQuantity },
            ],
          }}
        />
      )

      const makeButton = screen.getByText('Make')

      expect(makeButton).toBeDisabled()
    }
  )

  test.each([
    {
      grape: grapeChardonnay,
      grapeQuantity: GRAPES_REQUIRED_FOR_WINE,
      yeastQuantity: getYeastRequiredForWine(grapeChardonnay.variety),
    },
  ])(
    'enables "Make" button when there are sufficient ingredients ($grape.id: $grapeQuantity, yeast: $yeastQuantity)',
    ({ grape, grapeQuantity, yeastQuantity }) => {
      render(
        <WineRecipeStub
          props={{ wineVariety: grape.variety }}
          state={{
            inventory: [
              { id: grape.id, quantity: grapeQuantity },
              { id: yeast.id, quantity: yeastQuantity },
            ],
          }}
        />
      )

      const makeButton = screen.getByText('Make')

      expect(makeButton).toBeEnabled()
    }
  )
})
