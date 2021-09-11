import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'

import { toolLevel } from '../../enums'

import { memoize } from '../../utils'

import FarmhandContext from '../../Farmhand.context'
import toolsData from '../../data/tools'

import { tools as toolImages, craftedItems, pixel } from '../../img'

import './Toolbelt.sass'

const noop = () => {}
const getTools = memoize(shovelUnlocked => {
  return Object.values(toolsData)
    .filter(t => shovelUnlocked || t.id !== 'shovel')
    .sort(t => t.order)
})

const getToolImage = tool => {
  if (tool.level === toolLevel.DEFAULT) {
    return toolImages[tool.id]
  }

  let id = `${tool.id}-${tool.level.toLowerCase()}`
  return craftedItems[id]
}

export const Toolbelt = ({
  fieldMode: currentFieldMode,
  handleFieldModeSelect,
  completedAchievements,
  toolLevels,
}) => {
  const tools = getTools(completedAchievements['gold-digger'])

  return (
    <div className="Toolbelt">
      <div className="button-array">
        {tools.map(({ alt, fieldMode, fieldKey, hiddenText, id, type }) => (
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
                  style: {
                    backgroundImage: `url(${getToolImage({
                      level: toolLevels[type],
                      id,
                    })})`,
                  },
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
  completedAchievements: PropTypes.object,
}

Toolbelt.defaultProps = {
  handleFieldModeSelect: noop,
  completedAchievements: {},
  toolLevels: {},
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
