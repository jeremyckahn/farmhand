import createTheme from '@mui/material/styles/createTheme.js'
import { darken } from '@mui/material/styles/index.js'

import {
  cardStyleSelectedSx,
  cardStyleSx,
  spriteShadowSx,
} from './styles/sx.js'
import { breakpoints, colors, layout } from './styles/tokens.js'

import blueStripeBg from './img/ui/blue-stripe-bg.png'
import lightBlueStripeBg from './img/ui/light-blue-stripe-bg.png'

// These global styles used to live in Farmhand.sass, scoped by a `.Farmhand`
// class applied to many DOM roots across the app (including MUI Dialogs,
// which portal outside the main component tree). Injecting them once via
// MuiCssBaseline is a direct replacement that also sidesteps the reason
// that class trick existed in the first place (styling portalled content).
const globalStyleOverrides = {
  body: { overscrollBehavior: 'contain' },
  '.markdown': {
    '& p': { margin: '1em 0' },
    '& ul li': { listStyle: 'disc', marginLeft: '1em' },
    '& strong': { fontWeight: 'bold' },
  },
  img: { imageRendering: 'pixelated' },
  strong: { fontWeight: 'bold' },
  '.visually_hidden:not(:focus):not(:active)': {
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: '1px',
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
  },
  'h4, h5, h6, p, p.MuiTypography-root': {
    fontFamily: '"Public Sans", sans-serif',
  },
  'h3, h4, h5, h6': { fontWeight: 'bold' },
  h2: { fontSize: '1.4em' },
  'h3, h4': { margin: '1em 0' },
  'p, .MuiTypography-body2': { lineHeight: '1.5em' },
  'ul.card-list': {
    flexGrow: 1,
    marginBottom: '1em',
    '& li': { margin: '1em 0' },
    '& > li': { margin: '1em auto', maxWidth: layout.cardMaxWidth },
  },
  'input[type="number"]': { minWidth: '140px' },
  th: { fontWeight: 'bold' },
  'h1, h2, h3, h4, h5, h6, legend, td, th, .MuiTypography-h1, .MuiTypography-h2, .MuiTypography-h3, .MuiTypography-h4, .MuiTypography-h5, .MuiTypography-h6, .MuiButtonBase-root': {
    fontFamily: '"Francois One", sans-serif',
  },
  '.danger-text': { color: colors.error },
  hr: { background: 'none' },
  '.MuiDivider-vertical': { width: 'auto' },
  '.Farmhand.notification-container': {
    marginTop: '8em',
    paddingTop: 0,
    [`@media (min-width: ${breakpoints.md}px)`]: {
      marginTop: '4em',
      marginRight: '4em',
    },
    '& .MuiCollapse-wrapperInner': { width: '100%' },
    '& .MuiCollapse-wrapper': { marginBottom: 0 },
  },
  // Workaround for Safari layout rendering issues wherein bottom padding
  // for the stage and sidebar are not respected after interacting with the
  // elements within them. Used by both Farmhand.tsx and Stage.tsx.
  '.spacer': { minHeight: '7.5em' },
} as const

export default createTheme({
  palette: {
    mode: 'light',
  },
  shape: {},
  typography: {
    fontFamily: '"Public Sans", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: globalStyleOverrides,
    },
    MuiTabs: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: '#ffeec6',
          borderColor: '#9b6d00',
          borderWidth: 2,
          borderStyle: 'solid',
          borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
        }),
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          margin: '1rem 0',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...cardStyleSx(theme),
          '&.is-selected': cardStyleSelectedSx,
          '& .MuiCard-root': {
            background: darken(colors.cardBackground, 0.1),
          },
        }),
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...cardStyleSx(theme),
          '&.is-selected': cardStyleSelectedSx,
        }),
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        avatar: {
          '& img': spriteShadowSx,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          // Overrides an unhelpful MUI default
          '&:last-child': { padding: '16px' },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: '#e9c777' },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: { textTransform: 'none' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { backgroundColor: '#fff7e7' },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          '& p': { textAlign: 'center' },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: { display: 'block' },
        paper: { backgroundImage: `url(${lightBlueStripeBg})` },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { margin: '1.5em 0' },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          marginBottom: '1em',
          [`@media (min-width: 0px) and (orientation: landscape)`]: {
            top: '3.5em',
          },
          [`@media (min-width: ${breakpoints.sm}px)`]: { top: '4.5em' },
          '& p': {
            margin: '1em 0',
            '&:first-of-type': { marginTop: 0 },
            '&:last-child': { marginBottom: 0 },
          },
          '& strong': { fontWeight: 'bold' },
          '& li': { marginLeft: '1em' },
          '& ul li': { listStyle: 'disc' },
          '& ol li': { listStyle: 'decimal' },
        },
      },
    },
  },
})

// Re-exported so Farmhand.tsx can reference the same sidebar background
// asset without importing it a second time.
export { blueStripeBg }
