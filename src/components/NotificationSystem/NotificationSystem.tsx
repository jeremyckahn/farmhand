import React, { useEffect, forwardRef } from 'react'
import { func, shape, string } from 'prop-types'
import Alert from '@mui/material/Alert/index.js'
import ReactMarkdown from 'react-markdown'
import { withSnackbar, SnackbarContent } from 'notistack'

import { NOTIFICATION_DURATION } from '../../constants.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'

export const CustomContent = forwardRef<
  HTMLDivElement,
  farmhand.notification & { id: string | number; onClick?: () => void }
>(({ id, message, onClick, severity }, ref) => (
  <SnackbarContent ref={ref}>
    <Alert
      {...{
        elevation: 3,
        severity,
        onClick: onClick ? () => onClick() : undefined,
        style: {
          cursor: onClick ? 'pointer' : 'default',
          width: '100%',
          pointerEvents: 'auto',
        },
      }}
    >
      {/*
        onClick is bound here too (in addition to Alert above) because a
        click on Alert doesn't reliably reach native listeners through
        notistack's SnackbarContent wrapper. stopPropagation prevents this
        handler and Alert's handler from both firing for the same click.
      */}
      <div
        style={{ width: '100%' }}
        onClick={e => {
          if (onClick) {
            e.stopPropagation()
            onClick()
          }
        }}
      >
        <ReactMarkdown {...{ source: message }} />
      </div>
    </Alert>
  </SnackbarContent>
))

CustomContent.displayName = 'CustomContent'

export const NotificationSystem = ({
  closeSnackbar,
  enqueueSnackbar,
  latestNotification,
}: {
  closeSnackbar: () => void
  enqueueSnackbar: (message: string, options: any) => void
  latestNotification: farmhand.notification | null
}) => {
  useEffect(() => {
    if (latestNotification) {
      enqueueSnackbar(latestNotification.message, {
        autoHideDuration: NOTIFICATION_DURATION,
        onClose: () => closeSnackbar(),
        preventDuplicate: true,
        content: (key: string | number, message: string | React.ReactNode) => (
          <CustomContent
            id={key}
            message={message as string}
            onClick={latestNotification.onClick}
            severity={latestNotification.severity}
          />
        ),
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
