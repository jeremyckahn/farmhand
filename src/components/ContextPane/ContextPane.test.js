import React from 'react'
import { shallow } from 'enzyme'

import { stageFocusType } from '../../../src/enums'
import Inventory from '../Inventory'
import PlantableItems from '../PlantableItems'

import { ContextPane } from './ContextPane'

let component

beforeEach(() => {
  component = shallow(
    <ContextPane
      {...{
        playerInventory: [],
        stageFocus: stageFocusType.NONE,
      }}
    />
  )
})

describe('conditional UI', () => {
  describe('stageFocus', () => {
    describe('stageFocus === stageFocusType.FIELD', () => {
      beforeEach(() => {
        component.setProps({ stageFocus: stageFocusType.FIELD })
      })

      test('renders relevant UI', () => {
        expect(component.find(PlantableItems)).toHaveLength(1)
      })
    })

    describe('stageFocus === stageFocusType.SHOP', () => {
      beforeEach(() => {
        component.setProps({ stageFocus: stageFocusType.SHOP })
      })

      test('renders relevant UI', () => {
        expect(component.find(Inventory)).toHaveLength(1)
      })
    })
  })
})
