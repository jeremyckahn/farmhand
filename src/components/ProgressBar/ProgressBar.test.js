import React from 'react'
import { shallow } from 'enzyme'

import ProgressBar from './ProgressBar'

let component

beforeEach(() => {
  component = shallow(<ProgressBar {...{}} />)
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
