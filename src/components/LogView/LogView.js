import React from 'react'
import { array } from 'prop-types'
import Alert from '@material-ui/lab/Alert'
import ReactMarkdown from 'react-markdown'

import FarmhandContext from '../../Farmhand.context'

import './LogView.sass'

export const LogView = ({ notificationLog }) => (
  <ul className="LogView">
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
)

LogView.propTypes = {
  notificationLog: array.isRequired,
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
