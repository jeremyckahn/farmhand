import React from 'react'
import { shallow } from 'enzyme'

import { noop } from '../../utils/noop.js'

import AppBar from './AppBar.js'

let component

beforeEach(() => {
  component = shallow(
    <AppBar
      {...{
        handleClickNotificationIndicator: noop,
        money: 0,
        showNotifications: false,
        todaysNotifications: [],
        viewTitle: '',
      }}
    />
  )
})

it('renders', () => {
  expect(component).toHaveLength(1)
})
