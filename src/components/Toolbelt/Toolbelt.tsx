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
import { Div, Img } from '../Elements/index.js'
import { squareImgSx } from '../../styles/sx.js'
import { breakpoints } from '../../styles/tokens.js'

const getTools = memoize(
  (toolLevels: Record<farmhand.toolType, farmhand.toolLevel>) => {
    const tools: typeof toolsData[keyof typeof toolsData][] = []

    for (let tool of Object.values(toolsData)) {
      if (toolLevels[tool.type] !== toolLevel.UNAVAILABLE) {
        tools.push(tool)
      }
    }

    return tools.sort((a, b) => a.order - b.order)
  }
)

const getToolImage = (tool: { level: farmhand.toolLevel; id: string }) => {
  if (tool.level === toolLevel.DEFAULT) {
    return (toolImages as any)[tool.id]
  }

  const id = `${tool.id}-${tool.level.toLowerCase()}`

  return (craftedItems as any)[id]
}

interface ToolbeltProps {
  fieldMode: string
  handleFieldModeSelect: (mode: string) => void
  toolLevels: Record<farmhand.toolType, farmhand.toolLevel>
}

export const Toolbelt = ({
  fieldMode: currentFieldMode,
  handleFieldModeSelect,
  toolLevels,
}: ToolbeltProps) => {
  const tools = getTools(toolLevels)

  return (
    <Div className="Toolbelt">
      <Div
        className="button-array"
        sx={{
          display: 'flex',
          flexFlow: 'row',
          [`@media (orientation: landscape) and (min-height: ${breakpoints.largePhone}px)`]: {
            flexFlow: 'column',
          },
          '& button': { flexGrow: 1, margin: '0 0.5em' },
        }}
      >
        {tools.map(
          ({ alt, fieldMode, fieldKey, hiddenText, id, levelInfo, type }) => {
            const isSelected = fieldMode === currentFieldMode

            return (
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
                          source: (levelInfo as any)[toolLevels[type]],
                        }}
                      />
                      <p>({fieldKey})</p>
                    </Typography>
                  ),
                }}
              >
                <Button
                  {...{
                    className: classNames({ selected: isSelected }),
                    color: 'primary',
                    onClick: () => handleFieldModeSelect(fieldMode),
                    // Deliberately always 'text', never 'contained': the
                    // selected look is fully defined by the sx below, and
                    // 'contained' has more horizontal padding by default,
                    // which shrinks the button's content box and (since the
                    // icon sizes itself as 100% of that box, height
                    // following its intrinsic 1:1 aspect ratio) visibly
                    // shrinks the icon whenever a tool is selected.
                    variant: 'text',
                  }}
                  sx={
                    isSelected
                      ? {
                          border: '1px solid #000',
                          backgroundColor: 'transparent',
                          '&:hover': { backgroundColor: '#ffffb3' },
                        }
                      : undefined
                  }
                >
                  {/* alt is in a different format here because of linter weirdness. */}
                  <Img
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
                    sx={squareImgSx}
                    alt={alt}
                  />
                  <span className="visually_hidden">{hiddenText}</span>
                </Button>
              </Tooltip>
            )
          }
        )}
      </Div>
    </Div>
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

export default function Consumer(
  props: Partial<Parameters<typeof Toolbelt>[0]>
) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Toolbelt
          {...({
            ...gameState,
            ...handlers,
            ...props,
          } as Parameters<typeof Toolbelt>[0])}
        />
      )}
    </FarmhandContext.Consumer>
  )
}
