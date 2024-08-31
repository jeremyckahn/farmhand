import React from 'react'
import { shallow } from 'enzyme'

import AnimatedNumber from './AnimatedNumber.js'

let component

beforeEach(() => {
  component = shallow(<AnimatedNumber {...{ number: 0 }} />)
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
