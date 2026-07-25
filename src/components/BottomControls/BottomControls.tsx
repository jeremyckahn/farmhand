import React from 'react'
import classNames from 'classnames'
import { array, bool, func, string } from 'prop-types'

import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft.js'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight.js'
import MenuIcon from '@mui/icons-material/Menu.js'
import Fab from '@mui/material/Fab/index.js'
import Tooltip from '@mui/material/Tooltip/index.js'
import { Theme } from '@mui/material/styles/index.js'

import { STAGE_ICON_MAP, STAGE_TITLE_MAP } from '../../constants.js'
import { breakpoints, layout } from '../../styles/tokens.js'
import { Div } from '../Elements/index.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'

export const BottomControls = ({
  focusNextView,
  focusPreviousView,
  handleMenuToggle,
  handleViewChangeButtonClick,
  isMenuOpen,
  stageFocus,
  viewList,
}: {
  focusNextView: () => void
  focusPreviousView: () => void
  handleMenuToggle: () => void
  handleViewChangeButtonClick: (view: farmhand.stageFocusType) => void
  isMenuOpen: boolean
  stageFocus: farmhand.stageFocusType
  viewList: farmhand.stageFocusType[]
}) => (
  <Div
    className="bottom-controls"
    sx={(t: Theme) => ({
      alignItems: 'center',
      bottom: '1em',
      display: 'flex',
      flexFlow: 'column',
      justifyContent: 'center',
      left: '50%',
      position: 'fixed',
      transition: t.transitions.create('left', {
        duration: t.transitions.duration.enteringScreen,
        easing: t.transitions.easing.easeOut,
      }),
      width: 0,
      zIndex: 20,
      [`@media (max-width: ${breakpoints.mediumPhone}px)`]: {
        bottom: '0.5em',
      },
      '& .view-buttons': {
        display: 'flex',
        flexFlow: 'row',
        '& button': {
          backgroundColor: t.palette.grey[400],
          margin: '0 0.25em',
          position: 'relative',
          '& .view-icon': {
            fontSize: '1.3em',
          },
          '&:hover': {
            backgroundColor: t.palette.grey[500],
          },
          [`@media (max-width: ${breakpoints.mediumPhone}px)`]: {
            margin: '0 0.15em',
          },
          '@media (max-width: 320px)': {
            margin: '0 0.1em',
          },
          '&.selected': {
            backgroundColor: t.palette.common.white,
            border: `2px solid ${t.palette.primary.main}`,
            '&:hover': {
              backgroundColor: t.palette.grey[100],
            },
          },
        },
      },
      '& .fab-buttons': {
        display: 'flex',
        flexFlow: 'row',
        opacity: 0.85,
        '& button': {
          margin: '0.5em',
          position: 'relative',
          [`@media (max-width: ${breakpoints.mediumPhone}px)`]: {
            margin: '0.25em 0.5em',
          },
          '@media (max-width: 320px)': {
            margin: '0.25em 0.1em',
          },
        },
      },
      '& .menu-button': {
        transition: t.transitions.create('transform', {
          duration: t.transitions.duration.shorter,
        }),
        transform: isMenuOpen ? 'rotate(-90deg)' : 'rotate(0deg)',
      },
      ...(isMenuOpen && {
        '@media (orientation: landscape)': {
          left: `calc(50vw + ${layout.sidebarWidth} / 2)`,
        },
      }),
    })}
  >
    <div className="view-buttons">
      {viewList.map(view => {
        const isActive = view === stageFocus
        const viewKey = view as keyof typeof STAGE_TITLE_MAP

        return (
          <Tooltip
            key={view}
            arrow={true}
            placement="top"
            title={STAGE_TITLE_MAP[viewKey]}
          >
            <Fab
              aria-label={`Go to ${STAGE_TITLE_MAP[viewKey]}`}
              aria-current={isActive ? 'true' : undefined}
              className={classNames('view-button', { selected: isActive })}
              size="small"
              onClick={() => handleViewChangeButtonClick(view)}
            >
              <span className="view-icon" role="img" aria-hidden="true">
                {STAGE_ICON_MAP[viewKey]}
              </span>
            </Fab>
          </Tooltip>
        )
      })}
    </div>
    <div className="fab-buttons buttons">
      <Fab
        aria-label="Previous view"
        color="primary"
        onClick={focusPreviousView}
      >
        <KeyboardArrowLeft />
      </Fab>
      <Fab
        className={classNames('menu-button', { 'is-open': isMenuOpen })}
        color="primary"
        aria-label="Open drawer"
        onClick={() => handleMenuToggle()}
      >
        <MenuIcon />
      </Fab>
      <Fab aria-label="Next view" color="primary" onClick={focusNextView}>
        <KeyboardArrowRight />
      </Fab>
    </div>
  </Div>
)

BottomControls.propTypes = {
  focusNextView: func.isRequired,
  focusPreviousView: func.isRequired,
  handleMenuToggle: func.isRequired,
  handleViewChangeButtonClick: func.isRequired,
  isMenuOpen: bool.isRequired,
  stageFocus: string.isRequired,
  viewList: array.isRequired,
}

export default function Consumer(
  props: Partial<Parameters<typeof BottomControls>[0]>
) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <BottomControls
          {...({
            ...gameState,
            ...handlers,
            ...props,
          } as Parameters<typeof BottomControls>[0])}
        />
      )}
    </FarmhandContext.Consumer>
  )
}
