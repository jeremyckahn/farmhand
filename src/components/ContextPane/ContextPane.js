import React from 'react'
import { array, func, object, string } from 'prop-types'
import Button from '@material-ui/core/Button'

import FarmhandContext from '../../Farmhand.context'
import Inventory from '../Inventory'
import Toolbelt from '../Toolbelt'
import PlantableItems from '../PlantableItems'
import FieldTools from '../FieldTools'
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
    {stageFocus === stageFocusType.FIELD && (
      <>
        <header>
          <h3>Toolbelt</h3>
        </header>
        <Toolbelt />
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
        <header>
          <h3>Seeds</h3>
        </header>
        <PlantableItems />
        <header>
          <h3>Field Tools</h3>
        </header>
        <FieldTools />
      </>
    )}
    {stageFocus === stageFocusType.SHOP && (
      <>
        <h2>Inventory</h2>
        <Inventory
          {...{
            items: playerInventory,
          }}
        />
      </>
    )}
    {stageFocus === stageFocusType.COW_PEN && <CowPenContextMenu />}
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
