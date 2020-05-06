import React from 'react'
import { shallow } from 'enzyme'

import Field from '../Field'
import Inventory from '../Inventory'
import CowPen from '../CowPen'
import Shop from '../Shop'
import { stageFocusType } from '../../../src/enums'

import { Stage } from './Stage'

let component

beforeEach(() => {
  component = shallow(
    <Stage
      {...{
        field: [[]],
        isMenuOpen: true,
        playerInventory: [],
        stageFocus: stageFocusType.FIELD,
        viewTitle: '',
      }}
    />
  )
})

describe('focus', () => {
  describe('field', () => {
    beforeEach(() => {
      component.setProps({ gameState: { stageFocus: stageFocusType.FIELD } })
    })

    test('shows the field', () => {
      expect(component.find(Field)).toHaveLength(1)
    })
  })

  describe('shop', () => {
    beforeEach(() => {
      component.setProps({ stageFocus: stageFocusType.SHOP })
    })

    test('shows the shop', () => {
      expect(component.find(Shop)).toHaveLength(1)
    })
  })

  describe('cow pen', () => {
    beforeEach(() => {
      component.setProps({ stageFocus: stageFocusType.COW_PEN })
    })

    test('shows the cow pen', () => {
      expect(component.find(CowPen)).toHaveLength(1)
    })
  })

  describe('inventory', () => {
    beforeEach(() => {
      component.setProps({ stageFocus: stageFocusType.INVENTORY })
    })

    test('shows the inventory', () => {
      expect(component.find(Inventory)).toHaveLength(1)
    })
  })
})
