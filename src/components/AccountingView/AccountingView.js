import React from 'react'

import FarmhandContext from '../../Farmhand.context'

import './AccountingView.sass'

const AccountingView = () => <div className="AccountingView"></div>

AccountingView.propTypes = {}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <AccountingView {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
