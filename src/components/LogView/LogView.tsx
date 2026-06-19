import React from 'react'
import { array } from 'prop-types'
import Alert from '@mui/material/Alert/index.js'
import { AlertColor } from '@mui/material'
import ReactMarkdown from 'react-markdown'
import Divider from '@mui/material/Divider/index.js'

import FarmhandContext from '../Farmhand/Farmhand.context.js'

import './LogView.sass'

export const LogView = ({
  notificationLog,
  todaysNotifications,
}: {
  notificationLog: farmhand.notificationLogEntry[]
  todaysNotifications: farmhand.notification[]
}) => (
  <div className="LogView notification-container">
    <h3>Today</h3>
    <ul>
      {todaysNotifications.map(
        ({
          message,
          onClick,
          severity,
        }: farmhand.notification & { onClick?: () => void }) => (
          <li {...{ key: message }}>
            <Alert
              {...{
                elevation: 3,
                onClick,
                severity,
                style: {
                  cursor: onClick ? 'pointer' : 'default',
                },
              }}
            >
              <ReactMarkdown {...{ source: message }} />
            </Alert>
          </li>
        )
      )}
    </ul>
    <Divider />
    <ul>
      {notificationLog.map(
        (
          { day, notifications }: farmhand.notificationLogEntry,
          dayIndex: number
        ) => (
          <li key={`${dayIndex}_${notifications.info.join()}`}>
            <h3>Day {day}</h3>
            {['success', 'info', 'warning', 'error'].map(
              (severityLevel, severityIndex) =>
                notifications[
                  severityLevel as keyof farmhand.notificationLogEntry['notifications']
                ].length ? (
                  <Alert
                    {...{
                      elevation: 3,
                      key: `${severityLevel}_${severityIndex}`,
                      severity: severityLevel as AlertColor,
                    }}
                  >
                    {notifications[
                      severityLevel as keyof farmhand.notificationLogEntry['notifications']
                    ].map((message: string, messageIndex: number) => (
                      <ReactMarkdown
                        {...{
                          key: `${messageIndex}_${message}`,
                          source: message,
                        }}
                      />
                    ))}
                  </Alert>
                ) : null
            )}
          </li>
        )
      )}
    </ul>
  </div>
)

LogView.propTypes = {
  notificationLog: array.isRequired,
  todaysNotifications: array.isRequired,
}

export default function Consumer(
  props: Partial<Parameters<typeof LogView>[0]>
) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <LogView
          {...({
            ...gameState,
            ...handlers,
            ...props,
          } as Parameters<typeof LogView>[0])}
        />
      )}
    </FarmhandContext.Consumer>
  )
}
