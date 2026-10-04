import React, { useEffect } from 'react'
import Alert from '@mui/material/Alert/index.js'
import Button from '@mui/material/Button/index.js'
import ReactMarkdown from 'react-markdown'
import { withSnackbar } from 'notistack'

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
      <ReactMarkdown {...{ source: message }} />
    </Alert>
  )
})

export const snackbarProviderContentCallback = (
  key: string | number,
  notification: farmhand.notification
) => <NotificationAlert {...{ key, notification }} />

export const NotificationSystem = ({
  enqueueSnackbar,
  latestNotification,
  notificationDuration,
}: {
  enqueueSnackbar: (notification: farmhand.notification, options: any) => void
  latestNotification: farmhand.notification | null
  notificationDuration: number
}) => {
  useEffect(() => {
    if (!latestNotification) {
      return
    }

    // A stable, content-derived key (rather than a fresh object identity
    // every call) is what lets preventDuplicate below actually do
    // something - it skips enqueueing when a snack with this key is
    // already shown or queued, instead of stacking a duplicate. notistack
    // handles the rest of the lifecycle itself (auto-hide, then removal)
    // once autoHideDuration and a key are set - no onClose needed here.
    enqueueSnackbar(latestNotification, {
      key: getNotificationKey(latestNotification),
      autoHideDuration: getNotificationDuration(notificationDuration),
      preventDuplicate: true,
    })
  }, [enqueueSnackbar, latestNotification, notificationDuration])

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
