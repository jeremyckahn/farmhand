import React from 'react'
import { mount, render } from 'enzyme'

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
  let component //, mount

  describe('render', () => {
    beforeEach(() => {
      component = render(
        <Toolbelt fieldMode={fieldMode.OBSERVE} handleFieldModeSelect={noop} />
      )
    })

    test('renders a button for every tool', () => {
      expect(component.find('button')).toHaveLength(Object.keys(tools).length)
    })

    test('does not have any tool selected initially', () => {
      expect(component.find('.selected')).toHaveLength(0)
    })
  })

  describe('tool selection', () => {
    beforeEach(() => {
      class Wrapper extends React.Component {
        constructor(props) {
          super(props)

          this.state = {
            fieldMode: fieldMode.OBSERVE,
          }
        }

        handleFieldModeSelect = fieldMode => {
          this.setState({ fieldMode })
        }

        render() {
          return (
            <Toolbelt
              fieldMode={this.state.fieldMode}
              handleFieldModeSelect={this.handleFieldModeSelect}
            />
          )
        }
      }

      component = mount(<Wrapper />)
    })

    describe('a tool is selected', () => {
      test('marks a tool selected when it is clicked', () => {
        component
          .find('button')
          .first()
          .simulate('click')
        component.update()

        expect(
          component
            .find('button')
            .first()
            .prop('className')
            .includes('selected')
        ).toEqual(true)
      })
    })
  })
})
