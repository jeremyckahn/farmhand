import React from 'react'
import { shallow } from 'enzyme'

import QuickSelect from './QuickSelect'

let component

beforeEach(() => {
  component = shallow(<QuickSelect {...{}} />)
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
