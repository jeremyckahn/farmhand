import React from 'react'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import { func, string } from 'prop-types'
import classNames from 'classnames'

import FarmhandContext from '../../Farmhand.context'
import './Toolbelt.sass'
import { tools as toolImages, pixel } from '../../img'
import toolsData from '../../data/tools'

const tools = Object.values(toolsData).sort(t => t.order)

const noop = () => {}

export const Toolbelt = ({
  fieldMode: currentFieldMode,
  handleFieldModeSelect,
}) => {
  return (
    <div className="Toolbelt">
      <div className="button-array">
        {tools.map(({ alt, fieldMode, fieldKey, hiddenText, id }) => (
          <Tooltip
            {...{
              key: fieldMode,
              placement: 'top',
              title: (
                <>
                  <p>{alt}</p>
                  <p>({fieldKey})</p>
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
                  className: `square ${id}`,
                  src: pixel,
                  style: { backgroundImage: `url(${toolImages[id]}` },
                }}
                alt={alt}
              />
              <span className="visually_hidden">{hiddenText}</span>
            </Button>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}

Toolbelt.propTypes = {
  fieldMode: string.isRequired,
  handleFieldModeSelect: func,
}

Toolbelt.defaultProps = {
  handleFieldModeSelect: noop,
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
