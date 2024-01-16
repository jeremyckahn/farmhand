import React from 'react'

import FarmhandContext from '../Farmhand/Farmhand.context'

export const Forest = () => {
  return <div>'welcome to da forest'</div>
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Forest {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
