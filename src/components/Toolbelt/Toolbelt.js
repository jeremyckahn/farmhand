import React from 'react'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
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
    <div className="button-array">
      {[
        {
          alt: 'A watering can for hydrating plants.',
          fieldMode: WATER,
          toolImageId: 'watering-can',
        },
        {
          alt: 'A scythe for crop harvesting.',
          fieldMode: HARVEST,
          toolImageId: 'scythe',
        },
        {
          alt:
            'A hoe for removing crops and disposing of them. Also returns replantable items to your inventory.',
          fieldMode: CLEANUP,
          toolImageId: 'hoe',
        },
      ].map(({ alt, fieldMode, toolImageId }, i) => (
        <Tooltip
          {...{
            key: fieldMode,
            placement: 'top',
            title: (
              <>
                <p>{alt}</p>
                <p>(shift + {i + 1})</p>
              </>
            ),
          }}
        >
          <Button
            {...{
              className: classNames({
                selected: fieldMode === currentFieldMode,
              }),
              color: 'primary',
              onClick: () => handleFieldModeSelect(fieldMode),
              variant: fieldMode === currentFieldMode ? 'contained' : 'text',
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
        </Tooltip>
      ))}
    </div>
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
