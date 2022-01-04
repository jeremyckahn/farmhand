import React from 'react'
import { shallow } from 'enzyme'

import KeybindingsView from './KeybindingsView'

let component

beforeEach(() => {
  component = shallow(<KeybindingsView {...{}} />)
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
