import React from 'react'
import { render } from '@testing-library/react'
import { SnackbarProvider } from 'notistack'

import { NotificationSystem, getNotificationKey } from './NotificationSystem.js'

const defaultProps = {
  enqueueSnackbar: vitest.fn(),
  latestNotification: null,
}

const renderWithSnackbar = (component: React.ReactElement) => {
  return render(<SnackbarProvider>{component}</SnackbarProvider>)
}

test('renders', () => {
  renderWithSnackbar(<NotificationSystem {...defaultProps} />)
  // NotificationSystem renders null, so we just verify it doesn't crash
})

test('calls enqueueSnackbar with a content-derived key when latestNotification is provided', () => {
  // Regression test: notistack's closeSnackbar(key) invokes the matching
  // snack's own `onClose` before removing it from state. An onClose
  // handler here that calls closeSnackbar with its own key recurses
  // infinitely the moment the snack naturally auto-hides (stack overflow
  // after the first "Progress saved!" toast expires). No onClose handler
  // should be passed at all - notistack manages the snack's lifecycle
  // (auto-hide, then removal) on its own once autoHideDuration/key are set.
  // The exact-match assertion below guards against onClose (or any other
  // unexpected option) being reintroduced.
  const enqueueSnackbar = vitest.fn()
  const latestNotification: farmhand.notification = {
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
    key: 'info:Test notification',
    autoHideDuration: 1, // NOTIFICATION_DURATION in test mode
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

test('re-enqueues notification when latestNotification changes to a different message', () => {
  const enqueueSnackbar = vitest.fn()
  const initialNotification: farmhand.notification = {
    message: 'First notification',
    severity: 'info',
  }
  const newNotification: farmhand.notification = {
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
    key: getNotificationKey(initialNotification),
    autoHideDuration: 1,
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
    key: getNotificationKey(newNotification),
    autoHideDuration: 1,
    preventDuplicate: true,
  })
})

test('uses the same key for repeated notifications with identical message and severity, letting notistack dedupe them', () => {
  const enqueueSnackbar = vitest.fn()
  const firstNotification: farmhand.notification = {
    message: 'Progress saved!',
    severity: 'info',
  }
  const secondNotification: farmhand.notification = {
    message: 'Progress saved!',
    severity: 'info',
  }

  const { rerender } = renderWithSnackbar(
    <NotificationSystem
      {...defaultProps}
      enqueueSnackbar={enqueueSnackbar}
      latestNotification={firstNotification}
    />
  )

  rerender(
    <SnackbarProvider>
      <NotificationSystem
        {...defaultProps}
        enqueueSnackbar={enqueueSnackbar}
        latestNotification={secondNotification}
      />
    </SnackbarProvider>
  )

  expect(enqueueSnackbar).toHaveBeenCalledTimes(2)

  // Identical key is what allows notistack's own preventDuplicate to skip
  // showing a second toast while the first is still visible or queued.
  expect(enqueueSnackbar.mock.calls[0][1].key).toBe(
    enqueueSnackbar.mock.calls[1][1].key
  )
})
