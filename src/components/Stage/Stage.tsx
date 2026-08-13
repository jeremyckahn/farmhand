import React, { useEffect, useRef } from 'react'
import classNames from 'classnames'
import { array, arrayOf, bool, string } from 'prop-types'
import { Theme } from '@mui/material/styles/index.js'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import Field from '../Field/index.js'
import { Forest } from '../Forest/index.js'
import Home from '../Home/index.js'
import CowPen from '../CowPen/index.js'
import Shop from '../Shop/index.js'
import Workshop from '../Workshop/index.js'
import { Cellar } from '../Cellar/index.js'
import { stageFocusType } from '../../enums.js'
import { isOctober } from '../../utils/isOctober.js'
import { isDecember } from '../../utils/isDecember.js'
import { Div } from '../Elements/index.js'
import { breakpoints, layout } from '../../styles/tokens.js'

import brownDotBg from '../../img/ui/brown-dot-bg.png'
import floorboardBg from '../../img/ui/floorboard.png'
import jackOLanternBg from '../../img/ui/jack-o-lantern-bg.png'
import winterBg from '../../img/ui/winter-bg.png'
import yellowDotBg from '../../img/ui/yellow-dot-bg.png'
import lavenderDotBg from '../../img/ui/lavender-dot-bg.png'
import grassBg from '../../img/ui/grass.png'
import forestFloorBg from '../../img/ui/forest-floor.png'

interface StageProps {
  field: farmhand.plotContent[][]
  isMenuOpen?: boolean
  stageFocus: stageFocusType
  useAlternateEndDayButtonPosition?: boolean
  viewTitle: string
}

export const Stage = ({
  field,
  isMenuOpen = true,
  stageFocus,
  useAlternateEndDayButtonPosition = false,
  viewTitle,
}: StageProps) => {
  const ref = /** @type {React.MutableRefObject<HTMLDivElement | null>} */ useRef(
    null
  )

  useEffect(() => {
    if (ref.current) {
      const current = ref.current as HTMLDivElement
      const { style } = current

      // Set scroll position to the top
      current.scrollTop = 0

      // Stop any intertial scrolling
      style.overflow = 'hidden'
      setTimeout(() => (style.overflow = ''), 0)
    }
  }, [stageFocus])

  const backgroundImage = {
    [stageFocusType.HOME]: isOctober()
      ? jackOLanternBg
      : isDecember()
      ? winterBg
      : brownDotBg,
    [stageFocusType.SHOP]: yellowDotBg,
    [stageFocusType.WORKSHOP]: lavenderDotBg,
    [stageFocusType.CELLAR]: floorboardBg,
    [stageFocusType.FIELD]: grassBg,
    [stageFocusType.COW_PEN]: grassBg,
    [stageFocusType.FOREST]: forestFloorBg,
  }[stageFocus as string]

  return (
    <Div
      {...{
        className: classNames('Stage', {
          'is-october': isOctober(),
          'is-december': isDecember(),
        }),
        'data-stage-focus': stageFocus,
        role: 'main',
        ref,
      }}
      sx={(theme: Theme) => ({
        backgroundSize: '96px',
        flex: 2,
        imageRendering: 'pixelated',
        marginLeft: 0,
        overflow: 'auto',
        padding: '1.5em 1.5em 0',
        position: 'relative',
        transition: theme.transitions.create('margin-left', {
          duration: theme.transitions.duration.enteringScreen,
          easing: theme.transitions.easing.easeOut,
        }),
        ...(backgroundImage
          ? { backgroundImage: `url(${backgroundImage})` }
          : {}),
        ...(([
          stageFocusType.FIELD,
          stageFocusType.COW_PEN,
          stageFocusType.FOREST,
        ] as string[]).includes(stageFocus)
          ? {
              backgroundSize: '30%',
              [`@media (min-width: ${breakpoints.md}px)`]: {
                backgroundSize: '10%',
              },
            }
          : {}),
        // floorboard.png is a 144x48 (3:1) tile, unlike every other
        // background image here which is square - keep it at the same 2x
        // pixel-art scale as the rest (48px source -> 96px displayed) by
        // matching that same ratio instead of the shared square size.
        ...(stageFocus === stageFocusType.CELLAR
          ? { backgroundSize: '288px 96px' }
          : {}),
        '& h3': { textAlign: 'center' },
        '& h2': { fontSize: '1.2em' },
        '& .view-title': {
          fontSize: '2.5em',
          marginBottom: '0.6em',
          textAlign: 'center',
          [`@media (min-width: ${breakpoints.largePhone}px)`]: {
            display: 'none',
          },
        },
        '& section': {
          padding: '0.5em 0',
          [`@media (max-width: ${breakpoints.sm}px)`]: {
            fontSize: '1em',
          },
        },
        ...(useAlternateEndDayButtonPosition
          ? {
              paddingTop: '4em',
              [`@media (max-width: ${breakpoints.smallPhone}px)`]: {
                paddingTop: '4.5em',
              },
            }
          : {}),
        ...(isMenuOpen
          ? {
              transitionProperty: 'padding, margin-left',
              [`@media (max-width: ${breakpoints.sm}px)`]: {
                padding: 0,
              },
              '& > *': {
                opacity: 1,
                transition: theme.transitions.create('opacity', {
                  duration: theme.transitions.duration.enteringScreen,
                  easing: theme.transitions.easing.easeOut,
                }),
                [`@media (max-width: ${breakpoints.sm}px)`]: {
                  opacity: 0,
                },
              },
            }
          : {
              marginLeft: `-${layout.sidebarWidth}`,
              transition: theme.transitions.create('margin-left', {
                duration: theme.transitions.duration.leavingScreen,
                easing: theme.transitions.easing.sharp,
              }),
              [`@media (max-width: ${breakpoints.smallPhone}px)`]: {
                // NOTE: This must be a unit string, not a bare number - MUI's
                // sx prop treats numeric values for margin* keys as
                // multiples of theme.spacing() (8px by default) rather than
                // raw pixels.
                marginLeft: `-${layout.narrowSidebarWidth}px`,
              },
            }),
      })}
    >
      <h2 className="view-title">{viewTitle}</h2>
      {stageFocus === stageFocusType.HOME && <Home />}
      {stageFocus === stageFocusType.FIELD && (
        <Field
          {...{
            columns: field[0].length,
            rows: field.length,
          }}
        />
      )}
      {stageFocus === stageFocusType.FOREST && <Forest />}
      {stageFocus === stageFocusType.SHOP && <Shop />}
      {stageFocus === stageFocusType.COW_PEN && <CowPen />}
      {stageFocus === stageFocusType.WORKSHOP && <Workshop />}
      {stageFocus === stageFocusType.CELLAR && <Cellar />}
      <div {...{ className: 'spacer' }} />
    </Div>
  )
}

Stage.propTypes = {
  field: arrayOf(array).isRequired,
  isMenuOpen: bool,
  stageFocus: string.isRequired,
  useAlternateEndDayButtonPosition: bool,
  viewTitle: string.isRequired,
}

export default function Consumer(props: Partial<Parameters<typeof Stage>[0]>) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Stage
          {...({
            ...gameState,
            ...handlers,
            ...props,
          } as Parameters<typeof Stage>[0])}
        />
      )}
    </FarmhandContext.Consumer>
  )
}
