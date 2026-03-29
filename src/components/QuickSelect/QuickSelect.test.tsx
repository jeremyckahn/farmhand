import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { noop } from '../../utils/noop.js'
import { testItem } from '../../test-utils/index.js'

import QuickSelect from './QuickSelect.js'

// Mock sortItems to avoid itemsMap dependency issues
vi.mock('../../utils/index.js', async () => {
  const actual = await vi.importActual('../../utils/index.js')
  return {
    ...actual,
    sortItems: items => items, // Just return items as-is for testing
  }
})

const defaultProps = {
  fieldToolInventory: [],
  handleItemSelectClick: noop,
  playerInventoryQuantities: {},
  plantableCropInventory: [],
  selectedItemId: '',
}

test('renders', () => {
  render(<QuickSelect {...defaultProps} />)
  expect(document.querySelector('.QuickSelect')).toBeInTheDocument()
})

test('renders Toolbelt component', () => {
  render(<QuickSelect {...defaultProps} />)
  expect(document.querySelector('.Toolbelt')).toBeInTheDocument()
})

test('displays plantable crop inventory when available', () => {
  const plantableCropInventory = [
    testItem({ id: 'carrot-seed', name: 'Carrot Seed' }),
    testItem({ id: 'corn-seed', name: 'Corn Seed' }),
  ]
  const playerInventoryQuantities = {
    'carrot-seed': 5,
    'corn-seed': 3,
  }

  render(
    <QuickSelect
      {...defaultProps}
      plantableCropInventory={plantableCropInventory}
      playerInventoryQuantities={playerInventoryQuantities}
    />
  )

  expect(screen.getByText('5')).toBeInTheDocument()
  expect(screen.getByText('3')).toBeInTheDocument()
})

test('displays field tool inventory when available', () => {
  const fieldToolInventory = [
    testItem({ id: 'hoe', name: 'Hoe' }),
    testItem({ id: 'watering-can', name: 'Watering Can' }),
  ]
  const playerInventoryQuantities = {
    hoe: 1,
    'watering-can': 1,
  }

  render(
    <QuickSelect
      {...defaultProps}
      fieldToolInventory={fieldToolInventory}
      playerInventoryQuantities={playerInventoryQuantities}
    />
  )

  // Look for both quantity indicators for the field tools
  const quantities = screen.getAllByText('1')
  expect(quantities.length).toBeGreaterThanOrEqual(2)
})

test('shows selected item with contained variant', () => {
  const plantableCropInventory = [
    testItem({ id: 'carrot-seed', name: 'Carrot Seed' }),
    testItem({ id: 'corn-seed', name: 'Corn Seed' }),
  ]
  const playerInventoryQuantities = {
    'carrot-seed': 5,
    'corn-seed': 3,
  }

  render(
    <QuickSelect
      {...defaultProps}
      plantableCropInventory={plantableCropInventory}
      playerInventoryQuantities={playerInventoryQuantities}
      selectedItemId="carrot-seed"
    />
  )

  const selectedButton = document.querySelector('.is-selected')
  expect(selectedButton).toBeInTheDocument()
})

test('handles item clicking', async () => {
  const user = userEvent.setup()
  const handleItemSelectClick = vitest.fn()
  const carrotSeed = testItem({ id: 'carrot-seed', name: 'Carrot Seed' })
  const plantableCropInventory = [carrotSeed]
  const playerInventoryQuantities = { 'carrot-seed': 5 }

  render(
    <QuickSelect
      {...defaultProps}
      plantableCropInventory={plantableCropInventory}
      playerInventoryQuantities={playerInventoryQuantities}
      handleItemSelectClick={handleItemSelectClick}
    />
  )

  const carrotButton = screen.getByRole('button', { name: /carrot seed/i })
  await user.click(carrotButton)

  expect(handleItemSelectClick).toHaveBeenCalledWith(carrotSeed)
})

test('displays dividers between sections when multiple sections are present', () => {
  const plantableCropInventory = [
    testItem({ id: 'carrot-seed', name: 'Carrot Seed' }),
  ]
  const fieldToolInventory = [testItem({ id: 'hoe', name: 'Hoe' })]
  const playerInventoryQuantities = {
    'carrot-seed': 5,
    hoe: 1,
  }

  render(
    <QuickSelect
      {...defaultProps}
      plantableCropInventory={plantableCropInventory}
      fieldToolInventory={fieldToolInventory}
      playerInventoryQuantities={playerInventoryQuantities}
    />
  )

  const dividers = document.querySelectorAll('.MuiDivider-root')
  expect(dividers).toHaveLength(2)

  // Verify structural elements are present
  const toolbeltElement = document.querySelector('.Toolbelt')
  const buttonArrays = document.querySelectorAll('.button-array')
  const mainContainer = document.querySelector(
    '.QuickSelect .MuiGrid-container'
  )

  expect(toolbeltElement).toBeInTheDocument()
  expect(buttonArrays).toHaveLength(3) // One in Toolbelt, one for crops, one for field tools
  expect(mainContainer).toBeInTheDocument()

  if (!mainContainer) return
  const children = Array.from(mainContainer.children)

  // Find the indices of key elements
  const toolbeltIndex = children.findIndex(el =>
    el.classList.contains('Toolbelt')
  )
  const firstDividerIndex = children.findIndex(
    (el, index) =>
      index > toolbeltIndex && el.classList.contains('MuiDivider-root')
  )
  const firstItemListIndex = children.findIndex(
    (el, index) =>
      index > firstDividerIndex && el.classList.contains('button-array')
  )
  const secondDividerIndex = children.findIndex(
    (el, index) =>
      index > firstItemListIndex && el.classList.contains('MuiDivider-root')
  )
  const secondItemListIndex = children.findIndex(
    (el, index) =>
      index > secondDividerIndex && el.classList.contains('button-array')
  )

  // Verify the order: toolbelt < firstDivider < firstItemList < secondDivider < secondItemList
  expect(toolbeltIndex).toBeLessThan(firstDividerIndex)
  expect(firstDividerIndex).toBeLessThan(firstItemListIndex)
  expect(firstItemListIndex).toBeLessThan(secondDividerIndex)
  expect(secondDividerIndex).toBeLessThan(secondItemListIndex)
})

test('shows tooltips on hover', async () => {
  const user = userEvent.setup()
  const plantableCropInventory = [
    testItem({ id: 'carrot-seed', name: 'Carrot Seed' }),
  ]
  const playerInventoryQuantities = { 'carrot-seed': 5 }

  render(
    <QuickSelect
      {...defaultProps}
      plantableCropInventory={plantableCropInventory}
      playerInventoryQuantities={playerInventoryQuantities}
    />
  )

  const carrotButton = screen.getByRole('button', { name: /carrot seed/i })
  await user.hover(carrotButton)

  expect(await screen.findByText('Carrot Seed')).toBeInTheDocument()
})

test('displays item quantities correctly', () => {
  const plantableCropInventory = [
    testItem({ id: 'carrot-seed', name: 'Carrot Seed' }),
  ]
  const playerInventoryQuantities = { 'carrot-seed': 1500 }

  render(
    <QuickSelect
      {...defaultProps}
      plantableCropInventory={plantableCropInventory}
      playerInventoryQuantities={playerInventoryQuantities}
    />
  )

  expect(screen.getByText('1,500')).toBeInTheDocument()
})
