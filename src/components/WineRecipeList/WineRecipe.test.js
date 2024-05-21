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
 * @param {Partial<WineRecipeProps>} props
 * @param {Partial<typeof stubGameState>} state
 * @param {Partial<typeof stubHandlers>} handlers
 */
//const WineRecipeStub = (props = {}, state = {}, handlers = {}) => {

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
    { grape: grapeChardonnay },
    { grape: grapeSauvignonBlanc },
    { grape: grapeNebbiolo },
  ])('shows days to mature for $grape.id', ({ grape }) => {
    render(
      <WineRecipeStub
        props={{ wineVariety: grape.variety }}
        state={{ inventory: [{ id: grape.id, quantity: 1 }] }}
      />
    )

    const daysToMature = wineService.getDaysToMature(grape.variety)

    const label = screen.getByText(`Days to mature: ${daysToMature}`)

    expect(label).toBeInTheDocument()
  })

  xtest('shows grapes required', () => {})

  xtest('shows yeast required', () => {})

  xtest('shows number already in cellar', () => {})

  xtest('disables "Make" button when desired wine quantity cannot be made', () => {})
})
