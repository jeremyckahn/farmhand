import React from 'react'
import { shallow } from 'enzyme'

import SettingsView from './SettingsView'

let component

beforeEach(() => {
  component = shallow(<SettingsView {...{}} />)
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
