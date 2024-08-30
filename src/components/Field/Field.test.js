import React from 'react'
import { shallow } from 'enzyme'

import { fieldMode } from '../../enums'
import { testItem } from '../../test-utils'

import { INFINITE_STORAGE_LIMIT } from '../../constants'
import { noop } from '../../utils/noop'

import { Field, FieldContent, isInHoverRange, MemoPlot } from './Field'

vitest.mock('../../data/maps')
vitest.mock('../../data/items')
vitest.mock('../../data/levels', () => ({ levels: [] }))
vitest.mock('../../data/shop-inventory')
vitest.mock('../../img')

let component

beforeEach(() => {
  component = shallow(
    <Field
      {...{
        columns: 0,
        experience: 0,
        hoveredPlotRangeSize: 0,
        handleCombineEnabledChange: noop,
        handleFieldActionRangeChange: noop,
        rows: 0,
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
          rows: 0,
          setHoveredPlot: noop,
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

describe('isInHoverRange', () => {
  test('indicates when plot is not in hover range', () => {
    expect(
      isInHoverRange({
        experience: 0,
        hoveredPlotRangeSize: 2,
        hoveredPlot: { x: 1, y: 1 },
        x: 4,
        y: 4,
      })
    ).toBe(false)
  })

  test('indicates when plot is in hover range', () => {
    expect(
      isInHoverRange({
        experience: 0,
        hoveredPlotRangeSize: 2,
        hoveredPlot: { x: 1, y: 1 },
        x: 0,
        y: 0,
      })
    ).toBe(true)
  })

  describe('when observing the field', () => {
    test('indicates when plot is not in hover range', () => {
      expect(
        isInHoverRange({
          experience: 0,
          hoveredPlotRangeSize: 2,
          hoveredPlot: { x: 1, y: 1 },
          fieldMode: fieldMode.OBSERVE,
          x: 4,
          y: 4,
        })
      ).toBe(false)
    })

    test('indicates when plot is in hover range', () => {
      expect(
        isInHoverRange({
          experience: 0,
          hoveredPlotRangeSize: 2,
          hoveredPlot: { x: 1, y: 1 },
          fieldMode: fieldMode.OBSERVE,
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
          experience: 0,
          hoveredPlotRangeSize: 2,
          hoveredPlot: { x: 1, y: 1 },
          fieldMode: fieldMode.SET_SPRINKLER,
          x: 4,
          y: 4,
        })
      ).toBe(false)
    })

    test('indicates when plot is in hover range', () => {
      expect(
        isInHoverRange({
          experience: 0,
          hoveredPlotRangeSize: 2,
          hoveredPlot: { x: 1, y: 1 },
          fieldMode: fieldMode.SET_SPRINKLER,
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
          experience: 0,
          hoveredPlotRangeSize: 2,
          hoveredPlot: { x: 1, y: 1 },
          fieldMode: fieldMode.SET_SCARECROW,
          x: 2,
          y: 2,
        })
      ).toBe(true)

      expect(
        isInHoverRange({
          experience: 0,
          hoveredPlotRangeSize: 2,
          hoveredPlot: { x: 1, y: 1 },
          fieldMode: fieldMode.SET_SCARECROW,
          x: 100,
          y: 100,
        })
      ).toBe(true)
    })
  })
})
