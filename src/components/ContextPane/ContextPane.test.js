import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { stageFocusType } from '../../../src/enums.js'
import { testItem } from '../../test-utils/index.js'
import { INFINITE_STORAGE_LIMIT } from '../../constants.js'

import { ContextPane, PlayerInventory } from './ContextPane.js'

// Mock the Inventory component to avoid complex Item rendering
vi.mock('../Inventory/index.js', () => ({
  default: ({ items }) => (
    <div className="Inventory" data-testid="mocked-inventory">
      {items.map(item => (
        <div key={item.id} data-testid={`inventory-item-${item.id}`}>
          {item.name}
        </div>
      ))}
    </div>
  ),
}))

const defaultProps = {
  playerInventory: [],
  stageFocus: stageFocusType.NONE,
}

const baseItemProps = {
  completedAchievements: {},
  historicalValueAdjustments: [],
  inventory: [],
  inventoryLimit: INFINITE_STORAGE_LIMIT,
  money: 0,
  playerInventoryQuantities: {},
  valueAdjustments: {},
  adjustedValue: 0,
  previousDayAdjustedValue: 0,
  handleItemPurchaseClick: () => {},
  handleItemSelectClick: () => {},
  handleItemSellClick: () => {},
}

describe('ContextPane', () => {
  test('renders with default inventory view', () => {
    render(<ContextPane {...defaultProps} />)
    expect(screen.getByText('Inventory')).toBeInTheDocument()
    expect(screen.getByTestId('mocked-inventory')).toBeInTheDocument()
  })

  test('displays player inventory items', () => {
    const playerInventory = [
      testItem({ id: 'carrot', name: 'Carrot', quantity: 5 }),
      testItem({ id: 'corn', name: 'Corn', quantity: 3 }),
    ]

    render(
      <ContextPane
        {...defaultProps}
        {...baseItemProps}
        playerInventory={playerInventory}
      />
    )

    expect(screen.getByText('Inventory')).toBeInTheDocument()
    expect(screen.getByTestId('inventory-item-carrot')).toBeInTheDocument()
    expect(screen.getByTestId('inventory-item-corn')).toBeInTheDocument()
    expect(screen.getByText('Carrot')).toBeInTheDocument()
    expect(screen.getByText('Corn')).toBeInTheDocument()
  })

  describe('conditional UI based on stageFocus', () => {
    test('shows inventory view when stageFocus is SHOP', () => {
      const playerInventory = [
        testItem({ id: 'apple', name: 'Apple', quantity: 2 }),
      ]

      render(
        <ContextPane
          {...defaultProps}
          {...baseItemProps}
          playerInventory={playerInventory}
          stageFocus={stageFocusType.SHOP}
        />
      )

      expect(screen.getByText('Inventory')).toBeInTheDocument()
      expect(screen.getByTestId('inventory-item-apple')).toBeInTheDocument()
      expect(screen.getByText('Apple')).toBeInTheDocument()
    })

    test('shows inventory view when stageFocus is FIELD', () => {
      const playerInventory = [
        testItem({ id: 'seed', name: 'Seed', quantity: 10 }),
      ]

      render(
        <ContextPane
          {...defaultProps}
          {...baseItemProps}
          playerInventory={playerInventory}
          stageFocus={stageFocusType.FIELD}
        />
      )

      expect(screen.getByText('Inventory')).toBeInTheDocument()
      expect(screen.getByTestId('inventory-item-seed')).toBeInTheDocument()
      expect(screen.getByText('Seed')).toBeInTheDocument()
    })

    test('shows cow pen context menu instead of inventory when stageFocus is COW_PEN', () => {
      render(
        <ContextPane {...defaultProps} stageFocus={stageFocusType.COW_PEN} />
      )

      expect(screen.queryByText('Inventory')).not.toBeInTheDocument()
      expect(screen.queryByTestId('mocked-inventory')).not.toBeInTheDocument()
      expect(document.querySelector('.CowPenContextMenu')).toBeInTheDocument()
    })
  })

  test('displays all items from playerInventory in shop context', () => {
    const playerInventory = [
      testItem({ id: 'carrot', name: 'Carrot', quantity: 5 }),
      testItem({ id: 'corn', name: 'Corn', quantity: 3 }),
      testItem({ id: 'wheat', name: 'Wheat', quantity: 7 }),
    ]

    render(
      <ContextPane
        {...defaultProps}
        {...baseItemProps}
        playerInventory={playerInventory}
        stageFocus={stageFocusType.SHOP}
      />
    )

    expect(screen.getByTestId('inventory-item-carrot')).toBeInTheDocument()
    expect(screen.getByTestId('inventory-item-corn')).toBeInTheDocument()
    expect(screen.getByTestId('inventory-item-wheat')).toBeInTheDocument()
    expect(screen.getByText('Carrot')).toBeInTheDocument()
    expect(screen.getByText('Corn')).toBeInTheDocument()
    expect(screen.getByText('Wheat')).toBeInTheDocument()
  })
})

describe('PlayerInventory', () => {
  test('displays individual inventory items with their names', () => {
    const playerInventory = [
      testItem({ id: 'carrot', name: 'Carrot', quantity: 5 }),
      testItem({ id: 'potato', name: 'Potato', quantity: 2 }),
    ]

    render(
      <PlayerInventory {...baseItemProps} playerInventory={playerInventory} />
    )

    expect(screen.getByTestId('inventory-item-carrot')).toBeInTheDocument()
    expect(screen.getByTestId('inventory-item-potato')).toBeInTheDocument()
    expect(screen.getByText('Carrot')).toBeInTheDocument()
    expect(screen.getByText('Potato')).toBeInTheDocument()
  })

  test('shows empty inventory when no items present', () => {
    render(<PlayerInventory {...baseItemProps} playerInventory={[]} />)

    expect(screen.getByTestId('mocked-inventory')).toBeInTheDocument()
    expect(screen.queryByText('Carrot')).not.toBeInTheDocument()
    expect(screen.queryByText('Potato')).not.toBeInTheDocument()
  })

  test('correctly renders multiple different items', () => {
    const playerInventory = [
      testItem({ id: 'carrot', name: 'Carrot', quantity: 5 }),
      testItem({ id: 'corn', name: 'Corn', quantity: 3 }),
      testItem({ id: 'tomato', name: 'Tomato', quantity: 8 }),
    ]

    render(
      <PlayerInventory {...baseItemProps} playerInventory={playerInventory} />
    )

    // Verify all items are rendered with their correct names
    expect(screen.getByTestId('inventory-item-carrot')).toBeInTheDocument()
    expect(screen.getByTestId('inventory-item-corn')).toBeInTheDocument()
    expect(screen.getByTestId('inventory-item-tomato')).toBeInTheDocument()
    expect(screen.getByText('Carrot')).toBeInTheDocument()
    expect(screen.getByText('Corn')).toBeInTheDocument()
    expect(screen.getByText('Tomato')).toBeInTheDocument()
  })
})
