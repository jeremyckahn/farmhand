import React from 'react'
import { shallow } from 'enzyme'

import Plot from '../Plot'
import { fieldMode } from '../../enums'

import { Field } from './Field'

jest.mock('../../data/maps')
jest.mock('../../data/items')
jest.mock('../../img')

let component

beforeEach(() => {
  component = shallow(
    <Field
      {...{
        columns: 0,
        rows: 0,
        field: [
          [null, null],
          [null, null],
          [null, null],
        ],
        fieldMode: fieldMode.OBSERVE,
        purchasedField: 0,
      }}
    />
  )
})

describe('field rendering', () => {
  beforeEach(() => {
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
        .find(Plot)
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
