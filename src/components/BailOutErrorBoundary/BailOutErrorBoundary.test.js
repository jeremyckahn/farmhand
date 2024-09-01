import React from 'react'
import { shallow } from 'enzyme'

import BailOutErrorBoundary from './BailOutErrorBoundary.js'

let component

beforeEach(() => {
  component = shallow(<BailOutErrorBoundary {...{}} />)
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
