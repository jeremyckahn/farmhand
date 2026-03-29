import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { noop } from '../../utils/noop.js'

import { AppBar } from './AppBar.js'

const defaultProps = {
  handleClickNotificationIndicator: noop,
  money: 0,
  showNotifications: false,
  todaysNotifications: [],
  viewTitle: 'Test View',
}

test('renders', () => {
  render(<AppBar {...defaultProps} />)

  expect(screen.getByRole('banner')).toBeInTheDocument()
})

test('displays view title', () => {
  render(<AppBar {...defaultProps} viewTitle="My Farm" />)

  expect(screen.getByText('My Farm')).toBeInTheDocument()
})

test('displays money amount', () => {
  render(<AppBar {...defaultProps} money={1500} />)

  expect(screen.getByText('$1,500.00')).toBeInTheDocument()
})

test('shows notification indicator when notifications are hidden', () => {
  const todaysNotifications = [
    { severity: 'info', message: 'Test notification' },
  ]

  render(
    <AppBar
      {...defaultProps}
      showNotifications={false}
      todaysNotifications={todaysNotifications}
    />
  )

  expect(screen.getByText('1')).toBeInTheDocument()
})

test('hides notification indicator when notifications are shown', () => {
  const todaysNotifications = [
    { severity: 'info', message: 'Test notification' },
  ]
  render(
    <AppBar
      {...defaultProps}
      showNotifications={true}
      todaysNotifications={todaysNotifications}
    />
  )

  expect(screen.queryByText('1')).not.toBeInTheDocument()
})

test('shows error indicator when there are error notifications', () => {
  const todaysNotifications = [
    { severity: 'error', message: 'Error notification' },
  ]
  render(
    <AppBar
      {...defaultProps}
      showNotifications={false}
      todaysNotifications={todaysNotifications}
    />
  )

  expect(screen.getByRole('banner')).toBeInTheDocument()
  expect(document.querySelector('.error-indicator')).toBeInTheDocument()
})

test('calls handleClickNotificationIndicator when notification indicator is clicked', async () => {
  const user = userEvent.setup()
  const handleClick = vitest.fn()
  const todaysNotifications = [
    { severity: 'info', message: 'Test notification' },
  ]

  render(
    <AppBar
      {...defaultProps}
      handleClickNotificationIndicator={handleClick}
      showNotifications={false}
      todaysNotifications={todaysNotifications}
    />
  )

  const indicator = document.querySelector('.notification-indicator-container')
  expect(indicator).toBeInTheDocument()

  if (!indicator) throw new Error('Indicator not found')
  await user.click(indicator)

  expect(handleClick).toHaveBeenCalledTimes(1)
})
