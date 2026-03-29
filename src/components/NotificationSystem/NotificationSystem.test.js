import React from 'react'
import { render } from '@testing-library/react'
import { SnackbarProvider } from 'notistack'

import { NotificationSystem } from './NotificationSystem.js'

const defaultProps = {
  closeSnackbar: vitest.fn(),
  enqueueSnackbar: vitest.fn(),
  latestNotification: null,
}

const renderWithSnackbar = component => {
  return render(<SnackbarProvider>{component}</SnackbarProvider>)
}

test('renders', () => {
  renderWithSnackbar(<NotificationSystem {...defaultProps} />)
  // NotificationSystem renders null, so we just verify it doesn't crash
})

test('calls enqueueSnackbar when latestNotification is provided', () => {
  const enqueueSnackbar = vitest.fn()
  const latestNotification = {
    message: 'Test notification',
    severity: 'info',
  }

  renderWithSnackbar(
    <NotificationSystem
      {...defaultProps}
      enqueueSnackbar={enqueueSnackbar}
      latestNotification={latestNotification}
    />
  )

  expect(enqueueSnackbar).toHaveBeenCalledWith(latestNotification, {
    autoHideDuration: 1, // NOTIFICATION_DURATION in test mode
    onClose: expect.any(Function),
    preventDuplicate: true,
  })
})

test('does not call enqueueSnackbar when latestNotification is null', () => {
  const enqueueSnackbar = vitest.fn()

  renderWithSnackbar(
    <NotificationSystem
      {...defaultProps}
      enqueueSnackbar={enqueueSnackbar}
      latestNotification={null}
    />
  )

  expect(enqueueSnackbar).not.toHaveBeenCalled()
})

test('calls closeSnackbar when onClose is triggered', () => {
  const closeSnackbar = vitest.fn()
  const enqueueSnackbar = vitest.fn()
  const latestNotification = {
    message: 'Test notification',
    severity: 'info',
  }

  renderWithSnackbar(
    <NotificationSystem
      {...defaultProps}
      closeSnackbar={closeSnackbar}
      enqueueSnackbar={enqueueSnackbar}
      latestNotification={latestNotification}
    />
  )

  // Get the onClose function from the enqueueSnackbar call
  const onCloseCallback = enqueueSnackbar.mock.calls[0][1].onClose
  onCloseCallback()

  expect(closeSnackbar).toHaveBeenCalledTimes(1)
})

test('re-enqueues notification when latestNotification changes', () => {
  const enqueueSnackbar = vitest.fn()
  const initialNotification = {
    message: 'First notification',
    severity: 'info',
  }
  const newNotification = {
    message: 'Second notification',
    severity: 'success',
  }

  const { rerender } = renderWithSnackbar(
    <NotificationSystem
      {...defaultProps}
      enqueueSnackbar={enqueueSnackbar}
      latestNotification={initialNotification}
    />
  )

  expect(enqueueSnackbar).toHaveBeenCalledTimes(1)
  expect(enqueueSnackbar).toHaveBeenCalledWith(initialNotification, {
    autoHideDuration: 1,
    onClose: expect.any(Function),
    preventDuplicate: true,
  })

  // Change the notification
  rerender(
    <SnackbarProvider>
      <NotificationSystem
        {...defaultProps}
        enqueueSnackbar={enqueueSnackbar}
        latestNotification={newNotification}
      />
    </SnackbarProvider>
  )

  expect(enqueueSnackbar).toHaveBeenCalledTimes(2)
  expect(enqueueSnackbar).toHaveBeenLastCalledWith(newNotification, {
    autoHideDuration: 1,
    onClose: expect.any(Function),
    preventDuplicate: true,
  })
})
