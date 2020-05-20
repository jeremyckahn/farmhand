import React from 'react'
import { array } from 'prop-types'
import Alert from '@material-ui/lab/Alert'

import FarmhandContext from '../../Farmhand.context'

import './LogView.sass'

// FIXME: This needs to display all severity types.

const LogView = ({ notificationLog }) => (
  <ul className="LogView">
    {notificationLog.map(({ day, notifications }, i) => (
      <li key={`${i}_${notifications.info.join()}`}>
        <h3>Day {day}</h3>
        <Alert
          {...{
            elevation: 3,
            severity: 'info',
          }}
        >
          {notifications.info.map((message, i) => (
            <p key={`${i}_${message}`}>{message}</p>
          ))}
        </Alert>
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
