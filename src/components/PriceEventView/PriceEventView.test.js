import React from 'react'
import { shallow } from 'enzyme'

import PriceEventView from './PriceEventView'

let component

beforeEach(() => {
  component = shallow(<PriceEventView {...{}} />)
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
