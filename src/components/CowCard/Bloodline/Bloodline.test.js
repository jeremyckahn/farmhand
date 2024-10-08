import React from 'react'
import { shallow } from 'enzyme'

import Bloodline from './Bloodline.js'

let component

beforeEach(() => {
  component = shallow(<Bloodline {...{ colorsInBloodline: {} }} />)
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
