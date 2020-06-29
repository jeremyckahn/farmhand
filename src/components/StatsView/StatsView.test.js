import React from 'react'
import { shallow } from 'enzyme'

import StatsView from './StatsView'

let component

beforeEach(() => {
  component = shallow(<StatsView {...{}} />)
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
