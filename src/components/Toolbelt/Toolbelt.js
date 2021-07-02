import React from 'react'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import { func, string } from 'prop-types'
import classNames from 'classnames'

import FarmhandContext from '../../Farmhand.context'
import './Toolbelt.sass'
import { tools as toolImages, pixel } from '../../img'
import tools from '../../data/tools'

export const Toolbelt = ({
  fieldMode: currentFieldMode,
  handleFieldModeSelect,
}) => {
  let i = 0
  let toolbeltIcons = []

  for (const [toolId, tool] of Object.entries(tools)) {
    const { alt, fieldMode } = tool
    i += 1

    toolbeltIcons.push(
      <Tooltip
        {...{
          key: fieldMode,
          placement: 'top',
          title: (
            <>
              <p>{alt}</p>
              <p>(shift + {i})</p>
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
              className: `square ${toolId}`,
              src: pixel,
              style: { backgroundImage: `url(${toolImages[toolId]}` },
            }}
            alt={alt}
          />
        </Button>
      </Tooltip>
    )
  }

  return (
    <div className="Toolbelt">
      <div className="button-array">{toolbeltIcons}</div>
    </div>
  )
}

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
