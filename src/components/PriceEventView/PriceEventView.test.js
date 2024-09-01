import React from 'react'
import { shallow } from 'enzyme'

import PriceEventView from './PriceEventView.js'

let component

beforeEach(() => {
  component = shallow(
    <PriceEventView
      {...{
        priceCrashes: {},
        priceSurges: {},
      }}
    />
  )
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
