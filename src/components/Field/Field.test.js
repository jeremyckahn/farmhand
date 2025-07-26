import React from 'react'
import { render } from '@testing-library/react'

import { fieldMode } from '../../enums.js'
import { testItem, testCrop } from '../../test-utils/index.js'
import { INFINITE_STORAGE_LIMIT } from '../../constants.js'
import { noop } from '../../utils/noop.js'

import { Field, FieldContent, isInHoverRange, MemoPlot } from './Field.js'

// Mock Plot component to test MemoPlot memoization behavior
vitest.mock('../Plot/index.js', () => {
  const mockPlot = vitest.fn(({ x, y, isInHoverRange }) => (
    <div
      className="Plot"
      data-x={x}
      data-y={y}
      data-in-hover-range={isInHoverRange}
    />
  ))
  return { default: mockPlot }
})

// Mock complex dependencies
vitest.mock('../../data/maps.js')
vitest.mock('../../data/items.js')
vitest.mock('../../data/levels.js', () => ({ levels: [] }))
vitest.mock('../../data/shop-inventory.js')
vitest.mock('../../img/index.js', () => ({
  tools: {
    'watering-can': 'mock-watering-can.png',
    hoe: 'mock-hoe.png',
    scythe: 'mock-scythe.png',
    shovel: 'mock-shovel.png',
  },
  craftedItems: {},
  items: {},
  plotStates: {},
  wines: {},
  animals: {},
  pixel: 'mock-pixel.png',
}))
vitest.mock('react-zoom-pan-pinch', () => ({
  TransformWrapper: ({ children }) => (
    <div className="transform-wrapper">
      {children({
        scale: 1,
        previousScale: 1,
        resetTransform: () => {},
        zoomIn: () => {},
        zoomOut: () => {},
      })}
    </div>
  ),
  TransformComponent: ({ children }) => (
    <div className="transform-component">{children}</div>
  ),
}))

const defaultFieldProps = {
  columns: 2,
  experience: 0,
  hoveredPlotRangeSize: 0,
  handleCombineEnabledChange: noop,
  handleFieldActionRangeChange: noop,
  rows: 3,
  field: [
    [null, null],
    [null, null],
    [null, null],
  ],
  fieldMode: fieldMode.OBSERVE,
  inventory: [],
  inventoryLimit: INFINITE_STORAGE_LIMIT,
  isCombineEnabled: false,
  purchasedCombine: 0,
  purchasedField: 0,
}

const defaultFieldContentProps = {
  columns: 2,
  experience: 1,
  handleCombineEnabledChange: noop,
  field: [
    [null, null],
    [null, null],
    [null, null],
  ],
  hoveredPlot: {},
  hoveredPlotRangeSize: 0,
  fieldMode: fieldMode.OBSERVE,
  isCombineEnabled: false,
  purchasedCombine: 0,
  rows: 3,
  setHoveredPlot: noop,
}

describe('Field', () => {
  test('renders', () => {
    render(<Field {...defaultFieldProps} />)
    expect(document.querySelector('.Field')).toBeInTheDocument()
  })

  test('applies inventory full class when inventory is full', () => {
    const fullInventoryProps = {
      ...defaultFieldProps,
      inventoryLimit: 1,
      inventory: [testItem({ quantity: 1 })],
      fieldMode: fieldMode.HARVEST,
    }

    render(<Field {...fullInventoryProps} />)

    expect(
      document.querySelector('.Field.is-inventory-full')
    ).toBeInTheDocument()
  })

  test('does not apply inventory full class when inventory has space', () => {
    const props = {
      ...defaultFieldProps,
      inventoryLimit: 10,
      inventory: [testItem({ quantity: 1 })],
    }

    render(<Field {...props} />)

    expect(
      document.querySelector('.Field.is-inventory-full')
    ).not.toBeInTheDocument()
  })

  test('renders field content', () => {
    render(<Field {...defaultFieldProps} />)
    expect(document.querySelector('.row-wrapper')).toBeInTheDocument()
  })

  test('applies correct field mode class', () => {
    render(<Field {...defaultFieldProps} fieldMode={fieldMode.PLANT} />)
    expect(document.querySelector('.Field')).toHaveClass('plant-mode')
  })
})

describe('FieldContent', () => {
  test('renders field grid', () => {
    render(<FieldContent {...defaultFieldContentProps} />)
    expect(document.querySelector('.row-wrapper')).toBeInTheDocument()
  })

  test('renders correct number of rows', () => {
    render(<FieldContent {...defaultFieldContentProps} />)

    const rows = document.querySelectorAll('.row')
    expect(rows).toHaveLength(3)
  })

  test('renders correct number of plots per row', () => {
    render(<FieldContent {...defaultFieldContentProps} />)

    const firstRow = document.querySelector('.row')
    const plots = firstRow?.querySelectorAll('.Plot')
    expect(plots).toHaveLength(2)
  })

  test('renders field with crops', () => {
    const fieldWithCrops = [
      [testCrop({ itemId: 'carrot' }), null],
      [null, testCrop({ itemId: 'corn' })],
      [null, null],
    ]

    render(
      <FieldContent {...defaultFieldContentProps} field={fieldWithCrops} />
    )

    expect(document.querySelectorAll('.Plot')).toHaveLength(6) // 2 columns × 3 rows
  })

  test('handles different field modes', () => {
    render(
      <FieldContent {...defaultFieldContentProps} fieldMode={fieldMode.WATER} />
    )

    expect(document.querySelector('.row-wrapper')).toBeInTheDocument()
  })

  test('handles combine mode when enabled', () => {
    render(
      <FieldContent
        {...defaultFieldContentProps}
        isCombineEnabled={true}
        fieldMode={fieldMode.HARVEST}
      />
    )

    expect(document.querySelector('.row-wrapper')).toBeInTheDocument()
  })
})

describe('MemoPlot', () => {
  // Import the mocked Plot component to access its call count
  let MockedPlot
  beforeEach(async () => {
    const PlotModule = await import('../Plot/index.js')
    MockedPlot = PlotModule.default
    // @ts-expect-error - MockedPlot is a vitest mock function
    MockedPlot.mockClear()
  })

  const defaultPlotProps = {
    experience: 0,
    plotContent: null,
    x: 0,
    y: 0,
    fieldMode: fieldMode.OBSERVE,
    hoveredPlot: { x: null, y: null },
    hoveredPlotRangeSize: 0,
    setHoveredPlot: noop,
  }

  test('passes isInHoverRange calculation to Plot component', () => {
    const props = {
      ...defaultPlotProps,
      fieldMode: fieldMode.PLANT,
      hoveredPlot: { x: 1, y: 1 },
      hoveredPlotRangeSize: 1,
      x: 1,
      y: 1,
    }

    render(<MemoPlot {...props} />)

    expect(MockedPlot).toHaveBeenCalledWith(
      expect.objectContaining({
        isInHoverRange: true,
        hoveredPlot: { x: 1, y: 1 },
        plotContent: null,
        setHoveredPlot: noop,
        x: 1,
        y: 1,
      }),
      {}
    )
  })

  test('passes false for isInHoverRange when out of range', () => {
    const props = {
      ...defaultPlotProps,
      fieldMode: fieldMode.PLANT,
      hoveredPlot: { x: 0, y: 0 },
      hoveredPlotRangeSize: 1,
      x: 5,
      y: 5,
    }

    render(<MemoPlot {...props} />)

    expect(MockedPlot).toHaveBeenCalledWith(
      expect.objectContaining({
        isInHoverRange: false,
      }),
      {}
    )
  })

  test('memoizes when props that do not affect rendering remain the same', () => {
    const { rerender } = render(<MemoPlot {...defaultPlotProps} />)

    expect(MockedPlot).toHaveBeenCalledTimes(1)

    // Re-render with same props - should not call Plot again due to memoization
    rerender(<MemoPlot {...defaultPlotProps} />)

    expect(MockedPlot).toHaveBeenCalledTimes(1)
  })

  test('re-renders when plotContent changes', () => {
    const { rerender } = render(<MemoPlot {...defaultPlotProps} />)

    expect(MockedPlot).toHaveBeenCalledTimes(1)

    // Change plotContent - should trigger re-render
    const newProps = {
      ...defaultPlotProps,
      plotContent: testCrop({ itemId: 'carrot' }),
    }
    rerender(<MemoPlot {...newProps} />)

    expect(MockedPlot).toHaveBeenCalledTimes(2)
  })

  test('re-renders when hoveredPlotRangeSize changes', () => {
    const { rerender } = render(<MemoPlot {...defaultPlotProps} />)

    expect(MockedPlot).toHaveBeenCalledTimes(1)

    // Change hoveredPlotRangeSize - should trigger re-render
    const newProps = {
      ...defaultPlotProps,
      hoveredPlotRangeSize: 2,
    }
    rerender(<MemoPlot {...newProps} />)

    expect(MockedPlot).toHaveBeenCalledTimes(2)
  })

  test('re-renders when isInHoverRange result changes', () => {
    const initialProps = {
      ...defaultPlotProps,
      fieldMode: fieldMode.PLANT,
      hoveredPlot: { x: 1, y: 1 },
      hoveredPlotRangeSize: 1,
      x: 1,
      y: 1, // In range initially
    }

    const { rerender } = render(<MemoPlot {...initialProps} />)

    expect(MockedPlot).toHaveBeenCalledTimes(1)
    expect(MockedPlot).toHaveBeenLastCalledWith(
      expect.objectContaining({ isInHoverRange: true }),
      {}
    )

    // Move plot out of range - should trigger re-render
    const newProps = {
      ...initialProps,
      x: 5,
      y: 5, // Out of range now
    }
    rerender(<MemoPlot {...newProps} />)

    expect(MockedPlot).toHaveBeenCalledTimes(2)
    expect(MockedPlot).toHaveBeenLastCalledWith(
      expect.objectContaining({ isInHoverRange: false }),
      {}
    )
  })

  test('does not re-render when non-memoized props change but result is the same', () => {
    const initialProps = {
      ...defaultPlotProps,
      fieldMode: fieldMode.PLANT,
      hoveredPlot: { x: 1, y: 1 },
      hoveredPlotRangeSize: 1,
      x: 1,
      y: 1,
      experience: 0,
    }

    const { rerender } = render(<MemoPlot {...initialProps} />)

    expect(MockedPlot).toHaveBeenCalledTimes(1)

    // Change experience (which affects isInHoverRange calculation)
    // but result should be the same
    const newProps = {
      ...initialProps,
      experience: 100,
    }
    rerender(<MemoPlot {...newProps} />)

    // Should still only be called once due to memoization
    expect(MockedPlot).toHaveBeenCalledTimes(1)
  })

  test('handles null hoveredPlot coordinates correctly', () => {
    const props = {
      ...defaultPlotProps,
      fieldMode: fieldMode.PLANT,
      hoveredPlot: { x: null, y: null },
      hoveredPlotRangeSize: 1,
      x: 1,
      y: 1,
    }

    render(<MemoPlot {...props} />)

    expect(MockedPlot).toHaveBeenCalledWith(
      expect.objectContaining({
        isInHoverRange: false, // Should be false when hoveredPlot has null coordinates
      }),
      {}
    )
  })

  test('re-renders when hoveredPlot changes from null to valid coordinates', () => {
    const initialProps = {
      ...defaultPlotProps,
      fieldMode: fieldMode.PLANT,
      hoveredPlot: { x: null, y: null },
      hoveredPlotRangeSize: 1,
      x: 1,
      y: 1,
    }

    const { rerender } = render(<MemoPlot {...initialProps} />)

    expect(MockedPlot).toHaveBeenCalledTimes(1)
    expect(MockedPlot).toHaveBeenLastCalledWith(
      expect.objectContaining({ isInHoverRange: false }),
      {}
    )

    // Change hoveredPlot from null to valid coordinates
    const newProps = {
      ...initialProps,
      hoveredPlot: { x: 1, y: 1 },
    }
    rerender(<MemoPlot {...newProps} />)

    expect(MockedPlot).toHaveBeenCalledTimes(2)
    expect(MockedPlot).toHaveBeenLastCalledWith(
      expect.objectContaining({ isInHoverRange: true }),
      {}
    )
  })

  test('does not re-render in OBSERVE mode regardless of hover changes', () => {
    const initialProps = {
      ...defaultPlotProps,
      fieldMode: fieldMode.OBSERVE,
      hoveredPlot: { x: 1, y: 1 },
      hoveredPlotRangeSize: 1,
      x: 1,
      y: 1,
    }

    const { rerender } = render(<MemoPlot {...initialProps} />)

    expect(MockedPlot).toHaveBeenCalledTimes(1)

    // Change hoveredPlot coordinates - should not trigger re-render in OBSERVE mode
    // because isInHoverRange always returns false in OBSERVE mode
    const newProps = {
      ...initialProps,
      hoveredPlot: { x: 2, y: 2 },
    }
    rerender(<MemoPlot {...newProps} />)

    expect(MockedPlot).toHaveBeenCalledTimes(1)
  })
})

describe('isInHoverRange utility', () => {
  test('returns true when plot is in range', () => {
    const props = {
      experience: 0,
      fieldMode: fieldMode.PLANT,
      hoveredPlotRangeSize: 1,
      hoveredPlot: { x: 2, y: 2 },
      x: 3,
      y: 2,
    }

    expect(isInHoverRange(props)).toBe(true)
  })

  test('returns false when plot is out of range', () => {
    const props = {
      experience: 0,
      fieldMode: fieldMode.PLANT,
      hoveredPlotRangeSize: 1,
      hoveredPlot: { x: 0, y: 0 },
      x: 5,
      y: 5,
    }

    expect(isInHoverRange(props)).toBe(false)
  })

  test('handles range size of 0', () => {
    const props = {
      experience: 0,
      fieldMode: fieldMode.PLANT,
      hoveredPlotRangeSize: 0,
      hoveredPlot: { x: 2, y: 2 },
      x: 2,
      y: 2,
    }

    expect(isInHoverRange(props)).toBe(true)
  })

  test('handles different range sizes', () => {
    const props = {
      experience: 0,
      fieldMode: fieldMode.PLANT,
      hoveredPlotRangeSize: 2,
      hoveredPlot: { x: 5, y: 5 },
      x: 7,
      y: 7,
    }

    expect(isInHoverRange(props)).toBe(true)
  })

  test('returns false for plots at exact boundary', () => {
    const props = {
      experience: 0,
      fieldMode: fieldMode.PLANT,
      hoveredPlotRangeSize: 1,
      hoveredPlot: { x: 0, y: 0 },
      x: 2,
      y: 0,
    }

    expect(isInHoverRange(props)).toBe(false)
  })
})

// Integration tests for common field operations
describe('Field integration tests', () => {
  test('displays field in observe mode', () => {
    render(<Field {...defaultFieldProps} fieldMode={fieldMode.OBSERVE} />)

    expect(document.querySelector('.Field')).toBeInTheDocument()
    // OBSERVE mode doesn't add any specific CSS class, just verify field renders
    expect(document.querySelector('.Field')).not.toHaveClass('observe-mode')
  })

  test('displays field in plant mode', () => {
    render(<Field {...defaultFieldProps} fieldMode={fieldMode.PLANT} />)

    expect(document.querySelector('.Field')).toHaveClass('plant-mode')
  })

  test('displays field in water mode', () => {
    render(<Field {...defaultFieldProps} fieldMode={fieldMode.WATER} />)

    expect(document.querySelector('.Field')).toHaveClass('water-mode')
  })

  test('displays field in harvest mode', () => {
    render(<Field {...defaultFieldProps} fieldMode={fieldMode.HARVEST} />)

    expect(document.querySelector('.Field')).toHaveClass('harvest-mode')
  })

  test('renders field with mixed plot content', () => {
    const mixedField = [
      [testCrop({ itemId: 'carrot' }), null],
      [testCrop({ itemId: 'corn' }), testCrop({ itemId: 'potato' })],
      [null, null],
    ]

    render(<Field {...defaultFieldProps} field={mixedField} />)

    expect(document.querySelectorAll('.Plot')).toHaveLength(6)
  })

  test('handles large field sizes', () => {
    const largeField = Array(10)
      .fill(null)
      .map(() => Array(10).fill(null))

    render(
      <Field {...defaultFieldProps} field={largeField} rows={10} columns={10} />
    )

    expect(document.querySelectorAll('.Plot')).toHaveLength(100)
  })
})
