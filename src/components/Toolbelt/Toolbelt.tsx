import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import ReactMarkdown from 'react-markdown'

import Button from '@mui/material/Button/index.js'
import Tooltip from '@mui/material/Tooltip/index.js'
import Typography from '@mui/material/Typography/index.js'

import { toolLevel } from '../../enums.js'
import { memoize } from '../../utils/memoize.js'
import { noop } from '../../utils/noop.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'
import toolsData from '../../data/tools.js'

import { tools as toolImages, craftedItems, pixel } from '../../img/index.js'

import './Toolbelt.sass'

const getTools = memoize((toolLevels: farmhand.state['toolLevels']) => {
  const tools: (typeof toolsData)[keyof typeof toolsData][] = []

  for (let tool of Object.values(toolsData)) {
    if (toolLevels[tool.type as farmhand.toolType] !== toolLevel.UNAVAILABLE) {
      tools.push(tool)
    }
  }

  return tools.sort((a, b) => a.order - b.order)
})

const getToolImage = (tool: { level: farmhand.toolLevel; id: string }) => {
  if (tool.level === toolLevel.DEFAULT) {
    return (toolImages as Record<string, string>)[tool.id]
  }

  const id = `${tool.id}-${tool.level.toLowerCase()}`
  return (craftedItems as Record<string, string>)[id]
}

export const Toolbelt = ({
  fieldMode: currentFieldMode,
  handleFieldModeSelect,
  toolLevels,
}: {
  fieldMode: farmhand.fieldMode
  handleFieldModeSelect: (fieldMode: farmhand.fieldMode) => void
  toolLevels: farmhand.state['toolLevels']
}) => {
  const tools = getTools(toolLevels)

  return (
    <div className="Toolbelt">
      <div className="button-array">
        {tools.map(
          ({ alt, fieldMode, fieldKey, hiddenText, id, levelInfo, type }) => (
            <Tooltip
              followCursor
              {...{
                key: fieldMode,
                placement: 'top',
                title: (
                  <Typography component="div">
                    <p>{alt}</p>
                    <ReactMarkdown
                      {...{
                        className: 'markdown',
                        source: (levelInfo as any)[
                          toolLevels[type as farmhand.toolType]
                        ],
                      }}
                    />
                    <p>({fieldKey})</p>
                  </Typography>
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
}

Toolbelt.defaultProps = {
  handleFieldModeSelect: noop,
  toolLevels: {},
}

export default function Consumer(props: any) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Toolbelt {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
