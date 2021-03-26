import React, { useEffect } from 'react'
import { func, shape, string } from 'prop-types'
import { withSnackbar } from 'notistack'

import { NOTIFICATION_DURATION } from '../../constants'
import FarmhandContext from '../../Farmhand.context'
import './NotificationSystem.sass'

// FIXME: When notification is clicked, dismiss all notifications.
export const NotificationSystem = ({
  latestNotification,
  closeSnackbar,
  enqueueSnackbar,
}) => {
  useEffect(() => {
    if (latestNotification) {
      enqueueSnackbar(latestNotification, {
        autoHideDuration: NOTIFICATION_DURATION,
      })
    }
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

export default withSnackbar(function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <NotificationSystem {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
})
