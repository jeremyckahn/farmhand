import React from 'react'
import { shallow } from 'enzyme'

import { fieldMode } from '../../enums'
import { testItem } from '../../test-utils'

import { Field, FieldContent, isInHoverRange, MemoPlot } from './Field'
import { INVENTORY_LIMIT } from "../../constants";

jest.mock('../../data/maps')
jest.mock('../../data/items')
jest.mock('../../data/levels', () => ({ levels: [] }))
jest.mock('../../data/shop-inventory')
jest.mock('../../img')

let component

beforeEach(() => {
  component = shallow(
    <Field
      {...{
        columns: 0,
        hoveredPlotRangeSize: 0,
        handleCombineEnabledChange: () => {},
        handleFieldActionRangeChange: () => {},
        itemsSold: {},
        rows: 0,
        field: [
          [null, null],
          [null, null],
          [null, null],
        ],
        fieldMode: fieldMode.OBSERVE,
        inventory: [],
        inventoryLimit: INVENTORY_LIMIT,
        isCombineEnabled: false,
        purchasedCombine: 0,
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
          handleCombineEnabledChange: () => {},
          field: [
            [null, null],
            [null, null],
            [null, null],
          ],
          hoveredPlot: {},
          hoveredPlotRangeSize: 0,
          fieldMode: fieldMode.OBSERVE,
          isCombineEnabled: false,
          itemsSold: {},
          purchasedCombine: 0,
          rows: 0,
          setHoveredPlot: () => {},
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
    expect(component.find('.Field').hasClass('fertilize-mode')).toBeFalsy()
  })

  test('is present when fieldMode == FERTILIZE', () => {
    component.setProps({ fieldMode: fieldMode.FERTILIZE })
    expect(component.find('.Field').hasClass('fertilize-mode')).toBeTruthy()
  })
})

describe('plant-mode class', () => {
  test('is not present when fieldMode != PLANT', () => {
    expect(component.find('.Field').hasClass('plant-mode')).toBeFalsy()
  })

  test('is present when fieldMode == PLANT', () => {
    component.setProps({ fieldMode: fieldMode.PLANT })
    expect(component.find('.Field').hasClass('plant-mode')).toBeTruthy()
  })
})

describe('harvest-mode class', () => {
  test('is not present when fieldMode != HARVEST', () => {
    expect(component.find('.Field').hasClass('harvest-mode')).toBeFalsy()
  })

  test('is present when fieldMode == HARVEST', () => {
    component.setProps({ fieldMode: fieldMode.HARVEST })
    expect(component.find('.Field').hasClass('harvest-mode')).toBeTruthy()
  })
})

describe('is-inventory-full class', () => {
  beforeEach(() => {
    component.setProps({
      inventoryLimit: 2,
    })
  })

  test('is not present when inventory space remains', () => {
    expect(component.find('.Field').hasClass('is-inventory-full')).toBeFalsy()
  })

  test('is present when inventory space does not remain', () => {
    component.setProps({ fieldMode: fieldMode.HARVEST })
    component.setProps({
      inventory: [testItem({ quantity: 2 })],
    })
    expect(component.find('.Field').hasClass('is-inventory-full')).toBeTruthy()
  })
})

describe('cleanup-mode class', () => {
  test('is not present when fieldMode != CLEANUP', () => {
    expect(component.find('.Field').hasClass('cleanup-mode')).toBeFalsy()
  })

  test('is present when fieldMode == CLEANUP', () => {
    component.setProps({ fieldMode: fieldMode.CLEANUP })
    expect(component.find('.Field').hasClass('cleanup-mode')).toBeTruthy()
  })
})

describe('water-mode class', () => {
  test('is not present when fieldMode != WATER', () => {
    expect(component.find('.Field').hasClass('water-mode')).toBeFalsy()
  })

  test('is present when fieldMode == WATER', () => {
    component.setProps({ fieldMode: fieldMode.WATER })
    expect(component.find('.Field').hasClass('water-mode')).toBeTruthy()
  })
})

describe('isInHoverRange', () => {
  test('indicates when plot is not in hover range', () => {
    expect(
      isInHoverRange({
        hoveredPlotRangeSize: 2,
        hoveredPlot: { x: 1, y: 1 },
        itemsSold: {},
        x: 4,
        y: 4,
      })
    ).toBe(false)
  })

  test('indicates when plot is in hover range', () => {
    expect(
      isInHoverRange({
        hoveredPlotRangeSize: 2,
        hoveredPlot: { x: 1, y: 1 },
        itemsSold: {},
        x: 0,
        y: 0,
      })
    ).toBe(true)
  })

  describe('when observing the field', () => {
    test('indicates when plot is not in hover range', () => {
      expect(
        isInHoverRange({
          hoveredPlotRangeSize: 2,
          hoveredPlot: { x: 1, y: 1 },
          fieldMode: fieldMode.OBSERVE,
          itemsSold: {},
          x: 4,
          y: 4,
        })
      ).toBe(false)
    })

    test('indicates when plot is in hover range', () => {
      expect(
        isInHoverRange({
          hoveredPlotRangeSize: 2,
          hoveredPlot: { x: 1, y: 1 },
          fieldMode: fieldMode.OBSERVE,
          itemsSold: {},
          x: 0,
          y: 0,
        })
      ).toBe(false)
    })
  })

  describe('when placing a sprinkler', () => {
    test('indicates when plot is not in hover range', () => {
      expect(
        isInHoverRange({
          hoveredPlotRangeSize: 2,
          hoveredPlot: { x: 1, y: 1 },
          fieldMode: fieldMode.SET_SPRINKLER,
          itemsSold: {},
          x: 4,
          y: 4,
        })
      ).toBe(false)
    })

    test('indicates when plot is in hover range', () => {
      expect(
        isInHoverRange({
          hoveredPlotRangeSize: 2,
          hoveredPlot: { x: 1, y: 1 },
          fieldMode: fieldMode.SET_SPRINKLER,
          itemsSold: {},
          x: 0,
          y: 0,
        })
      ).toBe(true)
    })
  })

  describe('when placing a scarecrow', () => {
    test('indicates that all plots are in hover range', () => {
      expect(
        isInHoverRange({
          hoveredPlotRangeSize: 2,
          hoveredPlot: { x: 1, y: 1 },
          fieldMode: fieldMode.SET_SCARECROW,
          itemsSold: {},
          x: 2,
          y: 2,
        })
      ).toBe(true)

      expect(
        isInHoverRange({
          hoveredPlotRangeSize: 2,
          hoveredPlot: { x: 1, y: 1 },
          fieldMode: fieldMode.SET_SCARECROW,
          itemsSold: {},
          x: 100,
          y: 100,
        })
      ).toBe(true)
    })
  })
})
