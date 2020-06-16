import React from 'react'
import { string } from 'prop-types'

import FarmhandContext from '../../Farmhand.context'
import Inventory from '../Inventory'
import Toolbelt from '../Toolbelt'
import PlantableItems from '../PlantableItems'
import FieldTools from '../FieldTools'
import CowPenContextMenu from '../CowPenContextMenu'
import { stageFocusType } from '../../enums'

import './ContextPane.sass'

export const ContextPane = ({ playerInventory, stageFocus }) => (
  <div className="ContextPane">
    {stageFocus === stageFocusType.FIELD && (
      <>
        <header>
          <h3>Toolbelt</h3>
        </header>
        <Toolbelt />
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
