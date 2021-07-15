import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'

import { memoize } from '../../utils'

import FarmhandContext from '../../Farmhand.context'
import toolsData from '../../data/tools'

import { tools as toolImages, pixel } from '../../img'

import './Toolbelt.sass'

const noop = () => {}
const getTools = memoize(shovelUnlocked => {
  return Object.values(toolsData)
    .filter(t => shovelUnlocked || t.id !== 'shovel')
    .sort(t => t.order)
})

export const Toolbelt = ({
  fieldMode: currentFieldMode,
  handleFieldModeSelect,
  shovelUnlocked,
}) => {
  const tools = getTools(shovelUnlocked)

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
  fieldMode: PropTypes.string.isRequired,
  handleFieldModeSelect: PropTypes.func,
  shovelUnlocked: PropTypes.bool,
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
