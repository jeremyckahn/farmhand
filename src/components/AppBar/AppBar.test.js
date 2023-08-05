import React from 'react'
import { shallow } from 'enzyme'

import { noop } from '../../utils/noop'

import AppBar from './AppBar'

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
