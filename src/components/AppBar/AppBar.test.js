import React from 'react'
import { shallow } from 'enzyme'

import AppBar from './AppBar'

let component

beforeEach(() => {
  component = shallow(
    <AppBar
      {...{
        handleMenuToggle: () => {},
        money: 0,
        viewTitle: '',
      }}
    />
  )
})

it('renders', () => {
  expect(component).toHaveLength(1)
})
