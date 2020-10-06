import React from 'react'
import { array, func, object, string } from 'prop-types'
import Button from '@material-ui/core/Button'

import FarmhandContext from '../../Farmhand.context'
import Inventory from '../Inventory'
import CowPenContextMenu from '../CowPenContextMenu'
import { stageFocusType } from '../../enums'

import './ContextPane.sass'

export const ContextPane = ({
  completedAchievements,
  handleHarvestAllClick,
  playerInventory,
  stageFocus,
}) => (
  <div className="ContextPane">
    {stageFocus === stageFocusType.FIELD ? (
      <>
        <div className="bulk-operations">
          {completedAchievements['master-harvester'] && (
            <Button
              {...{
                color: 'primary',
                onClick: handleHarvestAllClick,
                variant: 'contained',
              }}
            >
              Harvest All
            </Button>
          )}
        </div>
        {/* TODO: Consolidate this Inventory with the one below. */}
        <h2>Inventory</h2>
        <Inventory
          {...{
            items: playerInventory,
          }}
        />
      </>
    ) : stageFocus === stageFocusType.COW_PEN ? (
      <CowPenContextMenu />
    ) : (
      <>
        <h2>Inventory</h2>
        <Inventory
          {...{
            items: playerInventory,
          }}
        />
      </>
    )}
  </div>
)

ContextPane.propTypes = {
  completedAchievements: object.isRequired,
  handleHarvestAllClick: func.isRequired,
  playerInventory: array.isRequired,
  stageFocus: string.isRequired,
}

export default function Consumer() {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <ContextPane {...{ ...gameState, ...handlers }} />
      )}
    </FarmhandContext.Consumer>
  )
}
