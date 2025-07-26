import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { testState } from '../../test-utils/index.js'
import FarmhandContext, {
  createContextData,
} from '../Farmhand/Farmhand.context.js'

import { PriceEventView } from './PriceEventView.js'

// Mock Item component to avoid complex dependencies
vi.mock('../Item/index.js', () => ({
  default: ({ item }) => (
    <div data-testid="item">{item?.name || 'Mock Item'}</div>
  ),
}))

const defaultProps = {
  priceCrashes: {},
  priceSurges: {},
}

const renderWithContext = (props = {}, gameState = {}, handlers = {}) => {
  const contextValue = createContextData()
  contextValue.gameState = {
    ...contextValue.gameState,
    ...testState(gameState),
  }
  contextValue.handlers = { ...contextValue.handlers, ...handlers }

  return render(
    <FarmhandContext.Provider value={contextValue}>
      <PriceEventView {...defaultProps} {...props} />
    </FarmhandContext.Provider>
  )
}

test('renders', () => {
  renderWithContext()
  expect(screen.getByText('Price Surges')).toBeInTheDocument()
  expect(screen.getByText('Price Crashes')).toBeInTheDocument()
})

test('displays price surges when present', () => {
  const priceSurges = {
    carrot: true,
    corn: true,
  }

  renderWithContext({ priceSurges })

  const surgeLists = document.querySelectorAll('.card-list')
  expect(surgeLists[0].children).toHaveLength(2)
})

test('displays price crashes when present', () => {
  const priceCrashes = {
    potato: true,
    wheat: true,
  }

  renderWithContext({ priceCrashes })

  const crashLists = document.querySelectorAll('.card-list')
  expect(crashLists[1].children).toHaveLength(2)
})

test('renders empty lists when no price events', () => {
  renderWithContext()

  const cardLists = document.querySelectorAll('.card-list')
  expect(cardLists[0].children).toHaveLength(0) // Price surges list
  expect(cardLists[1].children).toHaveLength(0) // Price crashes list
})

test('renders divider between sections', () => {
  renderWithContext()

  const divider = document.querySelector('.MuiDivider-root')
  expect(divider).toBeInTheDocument()
})
