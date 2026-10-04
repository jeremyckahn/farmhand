import React, { useEffect, useRef } from 'react'
import Alert from '@mui/material/Alert/index.js'
import Button from '@mui/material/Button/index.js'
import { withSnackbar } from 'notistack'

import { Markdown } from '../Markdown/index.js'

import { getNotificationDuration } from '../../constants.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'

export const getNotificationKey = ({
  message,
  severity,
}: farmhand.notification): string => `${severity}:${message}`

/**
 * Renders a notification as an Alert. A notification with an onClick gets a
 * button for it rather than making the whole Alert clickable: on Android,
 * clickable alerts rendered with a corrupted, partially dark frame.
 */
export const NotificationAlert = React.forwardRef<
  HTMLDivElement,
  { notification: farmhand.notification }
>(function NotificationAlert(
  { notification: { actionLabel = 'OK', message, onClick, severity } },
  ref
) {
  return (
    <Alert
      {...{
        ref,
        elevation: 3,
        severity,
        action: onClick ? (
          <Button
            {...{
              color: 'inherit',
              onClick,
              size: 'small',
              variant: 'outlined',
            }}
          >
            {actionLabel}
          </Button>
        ) : undefined,
      }}
    >
      <Markdown {...{ children: message }} />
    </Alert>
  )
})

export const snackbarProviderContentCallback = (
  key: string | number,
  notification: unknown
) => (
  <NotificationAlert
    {...{ key, notification: notification as farmhand.notification }}
  />
)

export const NotificationSystem = ({
  enqueueSnackbar,
  latestNotification,
  todaysNotifications = [],
  notificationDuration,
}: {
  enqueueSnackbar: (notification: farmhand.notification, options: any) => void
  latestNotification: farmhand.notification | null
  todaysNotifications?: farmhand.notification[]
  notificationDuration: number
}) => {
  const showNotification = (notification: farmhand.notification) => {
    // A stable, content-derived key (rather than a fresh object identity
    // every call) is what lets preventDuplicate below actually do
    // something - it skips enqueueing when a snack with this key is
    // already shown or queued, instead of stacking a duplicate. notistack
    // handles the rest of the lifecycle itself (auto-hide, then removal)
    // once autoHideDuration and a key are set - no onClose needed here.
    enqueueSnackbar(notification, {
      key: getNotificationKey(notification),
      autoHideDuration: getNotificationDuration(notificationDuration),
      preventDuplicate: true,
    })
  }

  useEffect(() => {
    if (!latestNotification) {
      return
    }

    showNotification(latestNotification)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enqueueSnackbar, latestNotification, notificationDuration])

  // latestNotification alone is lossy under React 18's automatic batching:
  // several showNotification reducer calls made synchronously (e.g. a
  // forEach over multiple pending notifications) collapse into a single
  // render, so the effect above only ever sees the last one. todaysNotifications
  // is a plain accumulating array built via functional state updates, so it
  // never loses entries regardless of batching - this catches up on any
  // notification that arrived and got skipped that way. Showing the same
  // notification through both paths is harmless: enqueueSnackbar's
  // preventDuplicate + stable key above just no-ops the repeat.
  const shownKeysRef = useRef(new Set<string>())

  useEffect(() => {
    if (todaysNotifications.length < shownKeysRef.current.size) {
      // A new day started and todaysNotifications was reset.
      shownKeysRef.current = new Set()
    }

    for (const notification of todaysNotifications) {
      const key = getNotificationKey(notification)

      if (shownKeysRef.current.has(key)) continue

      shownKeysRef.current.add(key)
      showNotification(notification)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enqueueSnackbar, todaysNotifications])

  return null
}

export default withSnackbar(function Consumer(props: any) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => {
        return (
          <NotificationSystem {...{ ...gameState, ...handlers, ...props }} />
        )
      }}
    </FarmhandContext.Consumer>
  )
})
