import React from 'react'
import { shallow } from 'enzyme'
import Alert from '@material-ui/lab/Alert'

import { LogView } from './LogView'

let component

beforeEach(() => {
  component = shallow(
    <LogView
      {...{
        notificationLog: [],
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
    expect(successAlert.text()).toEqual('yay')
    expect(errorAlert.props().severity).toEqual('error')
    expect(errorAlert.text()).toEqual('oh no')
  })
})
