import React from 'react'
import { array } from 'prop-types'
import SnackbarContent from '@material-ui/core/SnackbarContent'

import FarmhandContext from '../../Farmhand.context'

import './LogView.sass'

const LogView = ({ notificationLog }) => (
  <ul className="LogView">
    {notificationLog.map(({ day, notifications }, i) => (
      <li key={`${i}_${notifications.join()}`}>
        <h3>Day {day}</h3>
        <SnackbarContent
          {...{
            message: notifications.map((notification, i) => (
              <p key={`${i}_${notification}`}>{notification}</p>
            )),
          }}
        />
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
