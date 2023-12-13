import React from 'react'
import { shallow } from 'enzyme'

import { stageFocusType } from '../../../src/enums'

import { ContextPane, PlayerInventory } from './ContextPane'

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
    describe('stageFocus === stageFocusType.SHOP', () => {
      beforeEach(() => {
        component.setProps({ stageFocus: stageFocusType.SHOP })
      })

      test('renders relevant UI', () => {
        expect(component.find(PlayerInventory)).toHaveLength(1)
      })
    })
  })
})
