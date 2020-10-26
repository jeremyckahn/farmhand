import React from 'react'
import { shallow } from 'enzyme'

import QuantityInput from './QuantityInput'

let component

beforeEach(() => {
  component = shallow(
    <QuantityInput
      {...{
        handleSubmit: () => {},
        handleUpdateNumber: () => {},
        maxQuantity: 0,
        setQuantity: () => {},
        value: 0,
      }}
    />
  )
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
