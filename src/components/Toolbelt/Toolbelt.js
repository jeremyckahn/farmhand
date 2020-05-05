import React from 'react'
import Button from '@material-ui/core/Button'
import { func, string } from 'prop-types'
import classNames from 'classnames'

import FarmhandContext from '../../Farmhand.context'
import './Toolbelt.sass'
import { fieldMode } from '../../enums'
import { tools, pixel } from '../../img'

const { CLEANUP, HARVEST, WATER } = fieldMode

export const Toolbelt = ({
  fieldMode: currentFieldMode,
  handleFieldModeSelect,
}) => (
  <div className="Toolbelt">
    {[
      {
        alt: 'A watering can for hydrating plants',
        toolImageId: 'watering-can',
        fieldMode: WATER,
      },
      {
        alt: 'A scythe for crop harvesting',
        toolImageId: 'scythe',
        fieldMode: HARVEST,
      },
      {
        alt: 'A hoe for removing crops without harvesting them',
        toolImageId: 'hoe',
        fieldMode: CLEANUP,
      },
    ].map(({ alt, toolImageId, fieldMode }) => (
      <Button
        {...{
          className: classNames({
            selected: fieldMode === currentFieldMode,
          }),
          color: 'primary',
          key: fieldMode,
          onClick: () => handleFieldModeSelect(fieldMode),
          variant: fieldMode === currentFieldMode ? 'contained' : 'outlined',
        }}
      >
        {/* alt is in a different format here because of linter weirdness. */}
        <img
          {...{
            className: `square ${toolImageId}`,
            src: pixel,
            style: { backgroundImage: `url(${tools[toolImageId]}` },
          }}
          alt={alt}
        />
      </Button>
    ))}
  </div>
)

Toolbelt.propTypes = {
  fieldMode: string.isRequired,
  handleFieldModeSelect: func.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Toolbelt {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
