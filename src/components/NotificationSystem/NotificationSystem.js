import React from 'react'
import { arrayOf, bool, func, shape, string } from 'prop-types'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import ReactMarkdown from 'react-markdown'

import { NOTIFICATION_DURATION } from '../../constants'
import FarmhandContext from '../../Farmhand.context'
import './NotificationSystem.sass'

export const NotificationSystem = ({
  handleCloseNotification,
  handleNotificationClick,
  handleNotificationExited,
  notifications,
  doShowNotifications,
}) => (
  <div className="NotificationSystem">
    <Snackbar
      {...{
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        autoHideDuration: NOTIFICATION_DURATION,
        className: 'notification',
        onClick: handleNotificationClick,
        onClose: handleCloseNotification,
        onExited: handleNotificationExited,
        open: doShowNotifications,
      }}
    >
      {/*
      Notifications *must* be wrapped in a div, even though it would be a bit
      cleaner to use a Fragment. Without a wrapping div, the
      handleCloseNotification function tends to throw null reference errors
      that crash the game.
      */}
      <div className="wrapper">
        {notifications.map(({ message, onClick, severity }) => (
          <Alert
            {...{
              elevation: 3,
              key: `${severity}_${message}`,
              onClick,
              severity,
            }}
          >
            <ReactMarkdown {...{ source: message }} />
          </Alert>
        ))}
      </div>
    </Snackbar>
  </div>
)

NotificationSystem.propTypes = {
  handleCloseNotification: func.isRequired,
  handleNotificationClick: func.isRequired,
  handleNotificationExited: func.isRequired,
  notifications: arrayOf(
    shape({
      message: string.isRequired,
      severity: string.isRequired,
    })
  ).isRequired,
  doShowNotifications: bool.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <NotificationSystem {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
