import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// eslint-disable-next-line no-unused-vars
import uiHandlers from '../../handlers/ui-events.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'

import {
  appleCiderVinegar,
  appleJuice,
  balsamicVinegar,
  grapeSyrup,
  yeast,
} from '../../data/recipes.js'
import { integerString } from '../../utils/integerString.js'

import { getKegStub } from '../../test-utils/stubs/getKegStub.js'

import { QUANTITY_INPUT_PLACEHOLDER_TEXT } from '../QuantityInput/QuantityInput.js'

import { VinegarRecipe } from './VinegarRecipe.js'

const stubGameState: Pick<
  farmhand.state,
  'cellarInventory' | 'inventory' | 'purchasedCellar'
> = {
  cellarInventory: [],
  inventory: [{ id: appleJuice.id, quantity: 1 }],
  purchasedCellar: 1,
}

const stubHandlers: Pick<typeof uiHandlers, 'handleMakeVinegarClick'> = {
  handleMakeVinegarClick: vitest.fn(),
}

interface VinegarRecipeStubArgs {
  props?: Partial<{ recipe: farmhand.vinegar }>
  state?: Partial<
    Pick<farmhand.state, 'cellarInventory' | 'inventory' | 'purchasedCellar'>
  >
  handlers?: Partial<typeof stubHandlers>
}

const VinegarRecipeStub = (
  { props, state, handlers }: VinegarRecipeStubArgs = {
    props: { recipe: appleCiderVinegar },
    state: stubGameState,
    handlers: stubHandlers,
  }
) => {
  return (
    <FarmhandContext.Provider
      value={
        ({
          gameState: { ...stubGameState, ...state },
          handlers: {
            ...stubHandlers,
            ...handlers,
            debounced: { ...stubHandlers, ...handlers },
          },
        } as unknown) as React.ContextType<typeof FarmhandContext>
      }
    >
      <VinegarRecipe recipe={props?.recipe || appleCiderVinegar} {...props} />
    </FarmhandContext.Provider>
  )
}

describe('VinegarRecipe', () => {
  test.each([{ recipe: appleCiderVinegar }, { recipe: balsamicVinegar }])(
    'shows $recipe.daysToMature days to mature for $recipe.id',
    ({ recipe }) => {
      render(<VinegarRecipeStub props={{ recipe }} />)

      const label = screen.getByText(
        `Days to mature: ${integerString(recipe.daysToMature)}`
      )

      expect(label).toBeInTheDocument()
    }
  )

  test('shows ingredient requirements for each ingredient in the recipe', () => {
    render(
      <VinegarRecipeStub
        props={{ recipe: appleCiderVinegar }}
        state={{
          inventory: [
            { id: appleJuice.id, quantity: 10 },
            { id: yeast.id, quantity: 5 },
          ],
        }}
      />
    )

    expect(
      screen.getByText(
        `Units of ${appleJuice.name} required: ${integerString(
          10
        )} (available: ${integerString(10)})`
      )
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        `Units of ${yeast.name} required: ${integerString(
          5
        )} (available: ${integerString(5)})`
      )
    ).toBeInTheDocument()
  })

  test('shows the grape syrup ingredient for Balsamic Vinegar', () => {
    render(
      <VinegarRecipeStub
        props={{ recipe: balsamicVinegar }}
        state={{
          inventory: [
            { id: grapeSyrup.id, quantity: 24 },
            { id: yeast.id, quantity: 6 },
          ],
        }}
      />
    )

    expect(
      screen.getByText(
        `Units of ${grapeSyrup.name} required: ${integerString(
          24
        )} (available: ${integerString(24)})`
      )
    ).toBeInTheDocument()
  })

  test.each([
    { recipe: appleCiderVinegar, quantity: 0 },
    { recipe: balsamicVinegar, quantity: 3 },
  ])(
    'shows that there are already $quantity units of $recipe.id in cellar',
    ({ recipe, quantity }) => {
      render(
        <VinegarRecipeStub
          props={{ recipe }}
          state={{
            cellarInventory: new Array(quantity).fill(
              getKegStub({ itemId: recipe.id })
            ),
          }}
        />
      )

      const label = screen.getByText(`In cellar: ${integerString(quantity)}`)

      expect(label).toBeInTheDocument()
    }
  )

  test('disables "Make" button when there are insufficient ingredients', () => {
    render(
      <VinegarRecipeStub
        props={{ recipe: appleCiderVinegar }}
        state={{
          inventory: [
            { id: appleJuice.id, quantity: 0 },
            { id: yeast.id, quantity: 0 },
          ],
        }}
      />
    )

    const makeButton = screen.getByText('Make')

    expect(makeButton).toBeDisabled()
  })

  test('enables "Make" button when there are sufficient ingredients', () => {
    render(
      <VinegarRecipeStub
        props={{ recipe: appleCiderVinegar }}
        state={{
          inventory: [
            { id: appleJuice.id, quantity: 10 },
            { id: yeast.id, quantity: 5 },
          ],
        }}
      />
    )

    const makeButton = screen.getByText('Make')

    expect(makeButton).toBeEnabled()
  })

  test.each([{ vinegarYield: 1 }, { vinegarYield: 2 }])(
    'shows yeast requirements for $vinegarYield vinegar units',
    async ({ vinegarYield }) => {
      const yeastQuantity = 5 * vinegarYield
      const appleJuiceQuantity = 10 * vinegarYield

      render(
        <VinegarRecipeStub
          props={{ recipe: appleCiderVinegar }}
          state={{
            inventory: [
              { id: appleJuice.id, quantity: appleJuiceQuantity },
              { id: yeast.id, quantity: yeastQuantity },
            ],
          }}
        />
      )

      const input = screen.getByPlaceholderText(QUANTITY_INPUT_PLACEHOLDER_TEXT)

      await userEvent.clear(input)
      await userEvent.type(input, String(vinegarYield))

      const label = screen.getByText(
        `Units of ${yeast.name} required: ${integerString(
          5 * vinegarYield
        )} (available: ${integerString(yeastQuantity)})`
      )

      expect(label).toBeInTheDocument()
    }
  )
})
