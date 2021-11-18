import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import ReactMarkdown from 'react-markdown'

import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'

import { toolLevel } from '../../enums'

import { memoize } from '../../utils'

import FarmhandContext from '../../Farmhand.context'
import toolsData from '../../data/tools'

import { tools as toolImages, craftedItems, pixel } from '../../img'

import './Toolbelt.sass'

const noop = () => {}

const getTools = memoize(toolLevels => {
  const tools = []

  for (let tool of Object.values(toolsData)) {
    if (toolLevels[tool.type] !== toolLevel.UNAVAILABLE) {
      tools.push(tool)
    }
  }

  return tools.sort((a, b) => a.order > b.order)
})

const getToolImage = tool => {
  if (tool.level === toolLevel.DEFAULT) {
    return toolImages[tool.id]
  }

  const id = `${tool.id}-${tool.level.toLowerCase()}`
  return craftedItems[id]
}

export const Toolbelt = ({
  fieldMode: currentFieldMode,
  handleFieldModeSelect,
  completedAchievements,
  toolLevels,
}) => {
  const tools = getTools(toolLevels)

  return (
    <div className="Toolbelt">
      <div className="button-array">
        {tools.map(
          ({ alt, fieldMode, fieldKey, hiddenText, id, levelInfo, type }) => (
            <Tooltip
              {...{
                key: fieldMode,
                placement: 'top',
                title: (
                  <>
                    <p>{alt}</p>
                    <ReactMarkdown
                      {...{
                        className: 'markdown',
                        source: levelInfo[toolLevels[type]],
                      }}
                    />
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
                  variant:
                    fieldMode === currentFieldMode ? 'contained' : 'text',
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
          )
        )}
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
