import React from 'react'
import { array } from 'prop-types'
import Alert from '@material-ui/lab/Alert'

import FarmhandContext from '../../Farmhand.context'

import './LogView.sass'

const LogView = ({ notificationLog }) => (
  <ul className="LogView">
    {notificationLog.map(({ day, notifications }, i) => (
      <li key={`${i}_${notifications.join()}`}>
        <h3>Day {day}</h3>
        <Alert
          {...{
            elevation: 3,
            severity: 'info',
          }}
        >
          {notifications.map((notification, i) => (
            <p key={`${i}_${notification}`}>{notification}</p>
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
