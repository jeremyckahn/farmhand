import React from 'react'
import { shallow } from 'enzyme'

import { noop } from '../../utils/noop.js'

import QuantityInput from './QuantityInput.js'

let component

beforeEach(() => {
  component = shallow(
    <QuantityInput
      {...{
        handleSubmit: noop,
        handleUpdateNumber: noop,
        maxQuantity: 0,
        setQuantity: noop,
        value: 0,
      }}
    />
  )
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
