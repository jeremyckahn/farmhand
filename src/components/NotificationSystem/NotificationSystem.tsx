import React, { useEffect } from 'react'
import { func, shape, string } from 'prop-types'
import Alert from '@mui/material/Alert/index.js'
import ReactMarkdown from 'react-markdown'
import { withSnackbar } from 'notistack'

import { NOTIFICATION_DURATION } from '../../constants.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'

export const getNotificationKey = ({
  message,
  severity,
}: farmhand.notification): string => `${severity}:${message}`

export const snackbarProviderContentCallback = (
  key: string | number,
  {
    message,
    onClick,
    severity,
  }: farmhand.notification & { onClick?: () => void }
) => (
  <Alert
    {...{
      elevation: 3,
      key,
      onClick,
      severity,
      style: {
        cursor: onClick ? 'pointer' : 'default',
      },
    }}
  >
    <ReactMarkdown {...{ source: message }} />
  </Alert>
)

export const NotificationSystem = ({
  enqueueSnackbar,
  latestNotification,
}: {
  enqueueSnackbar: (notification: farmhand.notification, options: any) => void
  latestNotification: farmhand.notification | null
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
      autoHideDuration: NOTIFICATION_DURATION,
      preventDuplicate: true,
    })
  }, [enqueueSnackbar, latestNotification])

  return null
}

NotificationSystem.propTypes = {
  latestNotification: shape({
    message: string.isRequired,
    onClick: func,
    severity: string.isRequired,
  }),
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
