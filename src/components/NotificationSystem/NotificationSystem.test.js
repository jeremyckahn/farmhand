import React from 'react'
import { shallow } from 'enzyme'

import { NotificationSystem } from './NotificationSystem'

let component

beforeEach(() => {
  component = shallow(
    <NotificationSystem
      {...{
        handleCloseNotification: () => {},
        handleNotificationClick: () => {},
        handleNotificationExited: () => {},
        notifications: [],
        doShowNotifications: false,
      }}
    />
  )
})

test('renders', () => {
  expect(component.hasClass('NotificationSystem')).toBeTruthy()
})
