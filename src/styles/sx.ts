import { lighten, Theme } from '@mui/material/styles/index.js'

import { colors } from './tokens.js'

// NOTE: These are plain object literals (not typed as SxProps<Theme>) so
// they can be freely spread together into other sx objects — SxProps<Theme>
// is a union that also allows functions/arrays, which TS won't let you
// spread.

// Replaces the `.fill` utility class from the legacy Sass utils.
export const fillSx = {
  bottom: 0,
  left: 0,
  position: 'absolute',
  right: 0,
  top: 0,
} as const

// Replaces the `img.square` utility class from the legacy Sass utils.
export const squareImgSx = {
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  display: 'block',
  width: '100%',
} as const

// Replaces the `card-style` mixin. Merge cardStyleSelectedSx on top of this
// when the card's `is-selected` state is active.
export const cardStyleSx = (theme: Theme) => ({
  background: colors.cardBackground,
  border: 'solid 2px #b68000',
  transition: theme.transitions.create('background', {
    duration: theme.transitions.duration.enteringScreen,
    easing: theme.transitions.easing.easeOut,
  }),
})

export const cardStyleSelectedSx = {
  background: lighten(colors.cardBackground, 0.4),
} as const

// Replaces the `center-tabs` mixin.
export const centerTabsSx = {
  margin: '0 auto',
  maxWidth: 600,
  '& .MuiTabs-flexContainer': {
    justifyContent: 'center',
  },
  '& > .MuiTabs-root': {
    marginTop: '4em',
  },
  '& [role="tabpanel"]': {
    background: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '0 0 0.5em 0.5em',
    padding: '0.5em 0.5em 0.5em',
    '& .card-list > li:last-child': {
      marginBottom: 0,
    },
  },
} as const

// Replaces the `sprite-shadow` mixin.
export const spriteShadowSx = {
  filter: 'drop-shadow(2px 2px 2px rgba(100, 100, 100, 0.4))',
} as const
