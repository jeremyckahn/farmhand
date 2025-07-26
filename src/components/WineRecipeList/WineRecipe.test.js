import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// eslint-disable-next-line no-unused-vars
import uiHandlers from '../../handlers/ui-events.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'
import { wineService } from '../../services/wine.js'

import {
  grapeChardonnay,
  grapeNebbiolo,
  grapeSauvignonBlanc,
} from '../../data/crops/index.js'
import { yeast } from '../../data/recipes.js'
import { GRAPES_REQUIRED_FOR_WINE } from '../../constants.js'
import { integerString } from '../../utils/index.js'
import { getYeastRequiredForWine } from '../../utils/getYeastRequiredForWine.js'

import { getKegStub } from '../../test-utils/stubs/getKegStub.js'

import { QUANTITY_INPUT_PLACEHOLDER_TEXT } from '../QuantityInput/QuantityInput.js'

import { WineRecipe } from './WineRecipe.js'

/** @type {Pick<farmhand.state, 'cellarInventory' | 'inventory' | 'purchasedCellar'>} */
const stubGameState = {
  cellarInventory: [],
  inventory: [{ id: grapeChardonnay.id, quantity: 1 }],
  purchasedCellar: 1,
}

/** @type {Pick<uiHandlers, 'handleMakeWineClick'>} */
const stubHandlers = {
  handleMakeWineClick: vitest.fn(),
}

/**
 * @param {Partial<{
 *   props: Partial<{wineVariety: import('../../enums.js').grapeVariety}>,
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
    },
    {
      grape: grapeSauvignonBlanc,
    },
    {
      grape: grapeNebbiolo,
    },
  ])('shows yeast requirements for $grape.wineId', ({ grape }) => {
    const yeastQuantity = getYeastRequiredForWine(grape.variety)

    render(
      <WineRecipeStub
        props={{ wineVariety: grape.variety }}
        state={{
          inventory: [
            { id: grape.id, quantity: GRAPES_REQUIRED_FOR_WINE },
            { id: yeast.id, quantity: yeastQuantity },
          ],
        }}
      />
    )

    const label = screen.getByText(
      `Units of ${yeast.name} required: ${integerString(
        getYeastRequiredForWine(grape.variety)
      )} (available: ${integerString(yeastQuantity)})`
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

  test.each([{ wineYield: 1 }, { wineYield: 2 }])(
    'shows yeast requirements for $wineYield wines',
    ({ wineYield }) => {
      const grape = grapeChardonnay

      const yeastQuantity = getYeastRequiredForWine(grape.variety) * wineYield
      const grapeQuantity = GRAPES_REQUIRED_FOR_WINE * wineYield

      render(
        <WineRecipeStub
          props={{ wineVariety: grape.variety }}
          state={{
            inventory: [
              { id: grape.id, quantity: grapeQuantity },
              {
                id: yeast.id,
                quantity: yeastQuantity,
              },
            ],
          }}
        />
      )

      const input = screen.getByPlaceholderText(QUANTITY_INPUT_PLACEHOLDER_TEXT)

      userEvent.type(input, String(wineYield))

      const label = screen.getByText(
        `Units of ${yeast.name} required: ${integerString(
          getYeastRequiredForWine(grape.variety) * wineYield
        )} (available: ${integerString(yeastQuantity)})`
      )

      expect(label).toBeInTheDocument()
    }
  )
})
