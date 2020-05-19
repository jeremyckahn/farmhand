import React from 'react'
import { arrayOf, bool, func, string } from 'prop-types'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'

import { NOTIFICATION_DURATION } from '../../constants'
import FarmhandContext from '../../Farmhand.context'
import './NotificationSystem.sass'

export const NotificationSystem = ({
  handleCloseNotification,
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
        ContentProps: {
          'aria-describedby': 'farmhand-notification',
        },
        onClose: handleCloseNotification,
        onExited: handleNotificationExited,
        open: doShowNotifications,
      }}
    >
      <Alert
        {...{ elevation: 6, id: 'farmhand-notification', severity: 'info' }}
      >
        {notifications.map((notification, i) => (
          <p key={i}>{notification}</p>
        ))}
      </Alert>
    </Snackbar>
  </div>
)

NotificationSystem.propTypes = {
  handleCloseNotification: func.isRequired,
  handleNotificationExited: func.isRequired,
  notifications: arrayOf(string).isRequired,
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
