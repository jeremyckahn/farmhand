import React from 'react'
import Alert from '@mui/material/Alert/index.js'
import { AlertColor } from '@mui/material'

import Divider from '@mui/material/Divider/index.js'

import { Markdown } from '../Markdown/index.js'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import { Div } from '../Elements/index.js'
import { NotificationAlert } from '../NotificationSystem/NotificationSystem.js'

export const LogView = ({
  notificationLog,
  todaysNotifications,
}: {
  notificationLog: farmhand.notificationLogEntry[]
  todaysNotifications: farmhand.notification[]
}) => (
  <Div
    className="LogView notification-container"
    sx={{
      '& h3': { marginBottom: '1em' },
      '& .MuiAlert-root p:last-child': { marginBottom: 0 },
    }}
  >
    <h3>Today</h3>
    <ul>
      {todaysNotifications.map(notification => (
        <li key={notification.message}>
          <NotificationAlert {...{ notification }} />
        </li>
      ))}
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
                    key={`${severityLevel}_${severityIndex}`}
                    {...{
                      elevation: 3,
                      severity: severityLevel as AlertColor,
                    }}
                  >
                    {notifications[
                      severityLevel as keyof farmhand.notificationLogEntry['notifications']
                    ].map((message: string, messageIndex: number) => (
                      <Markdown
                        key={`${messageIndex}_${message}`}
                        {...{
                          children: message,
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
  </Div>
)

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
