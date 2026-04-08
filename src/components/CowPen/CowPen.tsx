import { array, bool, func, string } from 'prop-types'
import React, { useEffect } from 'react'

// eslint-disable-next-line no-unused-vars
import uiEvents from '../../handlers/ui-events.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'

import { Cow } from './Cow.js'
import { Tumbleweeds } from './Tumbleweeds.js'

import './CowPen.sass'

/**
 * @type {React.FC<
 *   Pick<
 *     farmhand.state, 'allowCustomPeerCowNames' | 'cowInventory' | 'playerId' | 'selectedCowId'>
 *   & Pick<uiEvents, 'handleCowPenUnmount' | 'handleCowClick'>
 * >}
 */
export const CowPen = ({
  allowCustomPeerCowNames,
  cowInventory,
  handleCowPenUnmount,
  handleCowClick,
  playerId,
  selectedCowId,
}) => {
  useEffect(() => {
    return () => {
      handleCowPenUnmount()
    }
  }, [handleCowPenUnmount])

  return (
    <div className="CowPen fill">
      <Tumbleweeds doSpawn={cowInventory.length === 0} />
      {cowInventory.map(cow => (
        <Cow
          {...{
            allowCustomPeerCowNames,
            cow,
            cowInventory,
            key: cow.id,
            handleCowClick,
            playerId,
            isSelected: selectedCowId === cow.id,
          }}
        />
      ))}
    </div>
  )
}

CowPen.propTypes = {
  allowCustomPeerCowNames: bool.isRequired,
  cowInventory: array.isRequired,
  handleCowClick: func.isRequired,
  handleCowPenUnmount: func.isRequired,
  playerId: string.isRequired,
  selectedCowId: string.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <CowPen {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
