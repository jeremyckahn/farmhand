import React, { useEffect } from 'react'
import { func, shape, string } from 'prop-types'
import Alert from '@mui/material/Alert/index.js'
import ReactMarkdown from 'react-markdown'
import { withSnackbar } from 'notistack'

import { NOTIFICATION_DURATION } from '../../constants.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'
import './NotificationSystem.sass'

export const snackbarProviderContentCallback = (
  key,
  { message, onClick, severity }
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
  closeSnackbar,
  enqueueSnackbar,
  latestNotification,
}) => {
  useEffect(() => {
    if (latestNotification) {
      enqueueSnackbar(latestNotification, {
        autoHideDuration: NOTIFICATION_DURATION,
        onClose: () => closeSnackbar(),
        preventDuplicate: true,
      })
    }
  }, [closeSnackbar, enqueueSnackbar, latestNotification])

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
      {({ gameState, handlers }) => {
        return (
          // @ts-expect-error - Complex prop spreading creates type mismatch with PropTypes
          <NotificationSystem {...{ ...gameState, ...handlers, ...props }} />
        )
      }}
    </FarmhandContext.Consumer>
  )
})
