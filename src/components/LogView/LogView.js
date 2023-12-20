import React from 'react'
import { array } from 'prop-types'
import Alert from '@mui/material/Alert'
import ReactMarkdown from 'react-markdown'
import Divider from '@mui/material/Divider'

import FarmhandContext from '../Farmhand/Farmhand.context'

import './LogView.sass'

export const LogView = ({ notificationLog, todaysNotifications }) => (
  <div className="LogView notification-container">
    <h3>Today</h3>
    <ul>
      {todaysNotifications.map(({ message, onClick, severity }) => (
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
      ))}
    </ul>
    <Divider />
    <ul>
      {notificationLog.map(({ day, notifications }, i) => (
        <li key={`${i}_${notifications.info.join()}`}>
          <h3>Day {day}</h3>
          {['success', 'info', 'warning', 'error'].map((severity, i) =>
            notifications[severity].length ? (
              <Alert {...{ elevation: 3, key: `${severity}_${i}`, severity }}>
                {notifications[severity].map((message, j) => (
                  <ReactMarkdown
                    {...{ key: `${j}_${message}`, source: message }}
                  />
                ))}
              </Alert>
            ) : null
          )}
        </li>
      ))}
    </ul>
  </div>
)

LogView.propTypes = {
  notificationLog: array.isRequired,
  todaysNotifications: array.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <LogView {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
