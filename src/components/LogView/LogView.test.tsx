import React from 'react'
import { render, screen } from '@testing-library/react'

import { LogView } from './LogView.js'

const defaultProps = {
  notificationLog: [],
  todaysNotifications: [],
}

test('renders', () => {
  render(<LogView {...defaultProps} />)
  expect(screen.getByText('Today')).toBeInTheDocument()
})

test("displays today's notifications", () => {
  const todaysNotifications = [
    {
      message: 'Test success message',
      severity: 'success',
    },
    {
      message: 'Test error message',
      severity: 'error',
    },
  ]

  render(
    <LogView {...defaultProps} todaysNotifications={todaysNotifications} />
  )

  expect(screen.getByText('Test success message')).toBeInTheDocument()
  expect(screen.getByText('Test error message')).toBeInTheDocument()
})

test('displays notification log for past days', () => {
  const notificationLog = [
    {
      day: 1,
      notifications: {
        error: ['Day 1 error'],
        info: ['Day 1 info'],
        success: [],
        warning: [],
      },
    },
    {
      day: 2,
      notifications: {
        error: [],
        info: [],
        success: ['Day 2 success'],
        warning: ['Day 2 warning'],
      },
    },
  ]

  render(<LogView {...defaultProps} notificationLog={notificationLog} />)

  expect(screen.getByText('Day 1')).toBeInTheDocument()
  expect(screen.getByText('Day 2')).toBeInTheDocument()
  expect(screen.getByText('Day 1 error')).toBeInTheDocument()
  expect(screen.getByText('Day 1 info')).toBeInTheDocument()
  expect(screen.getByText('Day 2 success')).toBeInTheDocument()
  expect(screen.getByText('Day 2 warning')).toBeInTheDocument()
})

describe('severity grouping', () => {
  test('filters and groups notifications by severity level', () => {
    const notificationLog = [
      {
        day: 1,
        notifications: {
          error: ['oh no'],
          info: [],
          success: ['yay'],
          warning: [],
        },
      },
    ]

    render(<LogView {...defaultProps} notificationLog={notificationLog} />)

    const alerts = document.querySelectorAll('[role="alert"]')
    expect(alerts).toHaveLength(2)

    expect(screen.getByText('yay')).toBeInTheDocument()
    expect(screen.getByText('oh no')).toBeInTheDocument()
  })

  test('does not render empty severity groups', () => {
    const notificationLog = [
      {
        day: 1,
        notifications: {
          error: [],
          info: ['info message'],
          success: [],
          warning: [],
        },
      },
    ]

    render(<LogView {...defaultProps} notificationLog={notificationLog} />)

    // Only one alert should be rendered (for info message)
    const alerts = document.querySelectorAll('[role="alert"]')
    expect(alerts).toHaveLength(1)
    expect(screen.getByText('info message')).toBeInTheDocument()
  })
})

test('renders multiple messages within same severity group', () => {
  const notificationLog = [
    {
      day: 1,
      notifications: {
        error: [],
        info: ['First info', 'Second info'],
        success: [],
        warning: [],
      },
    },
  ]

  render(<LogView {...defaultProps} notificationLog={notificationLog} />)

  expect(screen.getByText('First info')).toBeInTheDocument()
  expect(screen.getByText('Second info')).toBeInTheDocument()
})
