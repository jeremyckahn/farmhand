import React from 'react'
import { shallow } from 'enzyme'

import { NotificationSystem } from './NotificationSystem.js'

let component

beforeEach(() => {
  component = shallow(
    <NotificationSystem
      {...{
        closeSnackbar: () => {},
        enqueueSnackbar: () => {},
        latestNotification: null,
      }}
    />
  )
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
