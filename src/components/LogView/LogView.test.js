import React from 'react'
import { shallow } from 'enzyme'
import Alert from '@mui/material/Alert'
import ReactMarkdown from 'react-markdown'

import { LogView } from './LogView'

let component

beforeEach(() => {
  component = shallow(
    <LogView
      {...{
        notificationLog: [],
        todaysNotifications: [],
      }}
    />
  )
})

test('renders', () => {
  expect(component).toHaveLength(1)
})

describe('severity grouping', () => {
  test('filters and groups notifications by severity level', () => {
    component.setProps({
      notificationLog: [
        {
          day: 1,
          notifications: {
            error: ['oh no'],
            info: [],
            success: ['yay'],
            warning: [],
          },
        },
      ],
    })

    const alerts = component.find(Alert)
    expect(alerts).toHaveLength(2)

    const successAlert = alerts.at(0)
    const errorAlert = alerts.at(1)
    expect(successAlert.props().severity).toEqual('success')
    expect(successAlert.find(ReactMarkdown).props().source).toEqual('yay')
    expect(errorAlert.props().severity).toEqual('error')
    expect(errorAlert.find(ReactMarkdown).props().source).toEqual('oh no')
  })
})
