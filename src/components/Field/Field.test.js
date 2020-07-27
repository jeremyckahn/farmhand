import React from 'react'
import { shallow } from 'enzyme'

import { fieldMode } from '../../enums'
import { testItem } from '../../test-utils'

import { Field, FieldContent, isInHoverRange, MemoPlot } from './Field'

jest.mock('../../data/maps')
jest.mock('../../data/items')
jest.mock('../../data/shop-inventory')
jest.mock('../../img')

let component

beforeEach(() => {
  component = shallow(
    <Field
      {...{
        columns: 0,
        hoveredPlotRangeSize: 0,
        handleFieldZoom: () => {},
        rows: 0,
        field: [
          [null, null],
          [null, null],
          [null, null],
        ],
        fieldMode: fieldMode.OBSERVE,
        inventory: [],
        inventoryLimit: -1,
        purchasedField: 0,
      }}
    />
  )
})

describe('field rendering', () => {
  beforeEach(() => {
    component = shallow(
      <FieldContent
        {...{
          columns: 0,
          handleFieldZoom: () => {},
          rows: 0,
          field: [
            [null, null],
            [null, null],
            [null, null],
          ],
          fieldMode: fieldMode.OBSERVE,
          fitToScreen: true,
          purchasedField: 0,
          hoveredPlot: {},
          hoveredPlotRangeSize: 0,
          setFitToScreen: () => {},
          setHoveredPlot: () => {},
          zoomIn: () => {},
          zoomOut: () => {},
        }}
      />
    )
    component.setProps({ columns: 2, rows: 3 })
  })

  test('renders rows', () => {
    expect(component.find('.row')).toHaveLength(3)
  })

  test('renders columns', () => {
    expect(
      component
        .find('.row')
        .at(0)
        .find(MemoPlot)
    ).toHaveLength(2)
  })
})

describe('fertilize-mode class', () => {
  test('is not present when fieldMode != FERTILIZE', () => {
    expect(component.hasClass('fertilize-mode')).toBeFalsy()
  })

  test('is present when fieldMode == FERTILIZE', () => {
    component.setProps({ fieldMode: fieldMode.FERTILIZE })
    expect(component.hasClass('fertilize-mode')).toBeTruthy()
  })
})

describe('plant-mode class', () => {
  test('is not present when fieldMode != PLANT', () => {
    expect(component.hasClass('plant-mode')).toBeFalsy()
  })

  test('is present when fieldMode == PLANT', () => {
    component.setProps({ fieldMode: fieldMode.PLANT })
    expect(component.hasClass('plant-mode')).toBeTruthy()
  })
})

describe('harvest-mode class', () => {
  test('is not present when fieldMode != HARVEST', () => {
    expect(component.hasClass('harvest-mode')).toBeFalsy()
  })

  test('is present when fieldMode == HARVEST', () => {
    component.setProps({ fieldMode: fieldMode.HARVEST })
    expect(component.hasClass('harvest-mode')).toBeTruthy()
  })
})

describe('is-inventory-full class', () => {
  beforeEach(() => {
    component.setProps({
      inventoryLimit: 2,
    })
  })

  test('is not present when inventory space remains', () => {
    expect(component.hasClass('is-inventory-full')).toBeFalsy()
  })

  test('is present when inventory space does not remain', () => {
    component.setProps({ fieldMode: fieldMode.HARVEST })
    component.setProps({
      inventory: [testItem({ quantity: 2 })],
    })
    expect(component.hasClass('is-inventory-full')).toBeTruthy()
  })
})

describe('cleanup-mode class', () => {
  test('is not present when fieldMode != CLEANUP', () => {
    expect(component.hasClass('cleanup-mode')).toBeFalsy()
  })

  test('is present when fieldMode == CLEANUP', () => {
    component.setProps({ fieldMode: fieldMode.CLEANUP })
    expect(component.hasClass('cleanup-mode')).toBeTruthy()
  })
})

describe('water-mode class', () => {
  test('is not present when fieldMode != WATER', () => {
    expect(component.hasClass('water-mode')).toBeFalsy()
  })

  test('is present when fieldMode == WATER', () => {
    component.setProps({ fieldMode: fieldMode.WATER })
    expect(component.hasClass('water-mode')).toBeTruthy()
  })
})

describe('isInHoverRange', () => {
  describe('plot is not in hover range', () => {
    test('returns false', () => {
      expect(
        isInHoverRange({
          hoveredPlotRangeSize: 2,
          hoveredPlot: { x: 1, y: 1 },
          x: 4,
          y: 4,
        })
      ).toBe(false)
    })
  })

  describe('plot is in hover range', () => {
    test('returns true', () => {
      expect(
        isInHoverRange({
          hoveredPlotRangeSize: 2,
          hoveredPlot: { x: 1, y: 1 },
          x: 0,
          y: 0,
        })
      ).toBe(true)
    })
  })
})
