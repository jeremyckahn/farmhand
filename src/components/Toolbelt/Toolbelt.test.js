import React from 'react'
import { render, shallow } from 'enzyme'
import { createMount } from '@material-ui/core/test-utils'

import { fieldMode } from '../../enums'
import tools from '../../data/tools'

import { Toolbelt } from './Toolbelt'

const noop = () => {}

// https://stackoverflow.com/questions/58070996/how-to-fix-the-warning-uselayouteffect-does-nothing-on-the-server
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useLayoutEffect: jest.requireActual('react').useEffect,
}))

describe('<Toolbelt/>', () => {
  let component, mount

  beforeAll(() => (mount = createMount()))
  afterAll(() => mount.cleanUp())

  describe('render', () => {
    beforeEach(() => {
      component = mount(
        <Toolbelt fieldMode={fieldMode.OBSERVE} handleFieldModeSelect={noop} />
      )
    })

    test('renders a Button for every tool', () => {
      expect(component.find('Button')).toHaveLength(Object.keys(tools).length)
    })

    test('does not have any tool selected initially', () => {
      expect(component.find('.selected')).toHaveLength(0)
    })
  })

  describe('tool selection', () => {
    beforeEach(() => {
      component = mount(
        <Toolbelt fieldMode={fieldMode.OBSERVE} handleFieldModeSelect={noop} />
      )
      console.log(component.debug())
    })

    describe('a tool is selected', () => {
      test('marks a tool selected when it is clicked', () => {
        component
          .find('Button')
          .first()
          .simulate('click')
        expect(component.find('.selected').find('.watering-can')).toHaveLength(
          1
        )
      })
    })
  })
})
