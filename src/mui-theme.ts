import { darken, Theme } from '@mui/material/styles/index.js'
import { createElement } from 'react'
import createTheme from '@mui/material/styles/createTheme.js'
import type { Shadows } from '@mui/material/styles/shadows.js'

import {
  ArrowDropDownIcon,
  CheckBoxIcon,
  CheckBoxOutlineBlankIcon,
  ErrorIcon,
  IndeterminateCheckBoxIcon,
  InfoIcon,
  SuccessIcon,
  WarningIcon,
} from './components/PixelIcon/index.js'
import blueStripeBg from './img/ui/blue-stripe-bg.png'
import lightBlueStripeBg from './img/ui/light-blue-stripe-bg.png'
import {
  cardStyleSelectedSx,
  cardStyleSx,
  spriteShadowSx,
} from './styles/sx.js'
import { fontFaces } from './styles/fonts.js'
import {
  pixelBevel,
  pixelBevelPressed,
  pixelFrameSx,
  pixelPressedSx,
  pixelShadowColor,
  px,
} from './styles/pixel.js'
import { breakpoints, colors, fonts, layout } from './styles/tokens.js'

type PaletteColorName =
  'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'

const paletteColorNames = new Set<string>([
  'primary',
  'secondary',
  'error',
  'warning',
  'info',
  'success',
])

const isPaletteColorName = (color: unknown): color is PaletteColorName =>
  typeof color === 'string' && paletteColorNames.has(color)

// Pixel art outlines read best when they're a deep shade of the fill color
// rather than a flat black.
const outlineFor = (theme: Theme, color: unknown) =>
  isPaletteColorName(color)
    ? darken(theme.palette[color].main, 0.5)
    : colors.neutralOutline

// Every elevation gets the same hard, unblurred pixel art drop shadow rather
// than MUI's soft Material Design shadows.
const pixelShadow = `${px(1)} ${px(1)} 0 0 ${pixelShadowColor}`
const shadows = [
  'none',
  ...Array<string>(24).fill(pixelShadow),
] as unknown as Shadows

// Shared by Button and Fab: a raised 9-slice frame that gets pushed into its
// shadow when pressed.
const raisedControlSx = (outline: string) =>
  ({
    ...pixelFrameSx({ outline, shadow: true }),
    boxShadow: pixelBevel(),
    '&:hover': { boxShadow: pixelBevel() },
    '&.Mui-focusVisible': { boxShadow: pixelBevel() },
    '&:active': pixelPressedSx(outline),
    '&.Mui-disabled': {
      ...pixelFrameSx({ outline: colors.disabledOutline, shadow: 'pressed' }),
      boxShadow: 'none',
    },
  }) as const

// These global styles used to live in Farmhand.sass, scoped by a `.Farmhand`
// class applied to many DOM roots across the app (including MUI Dialogs,
// which portal outside the main component tree). Injecting them once via
// MuiCssBaseline is a direct replacement that also sidesteps the reason
// that class trick existed in the first place (styling portalled content).
const globalStyleOverrides = {
  body: {
    overscrollBehavior: 'contain',
    // This typeface only has a regular weight, so let the browser
    // synthesize bold (otherwise bold labels like "In inventory:" lose
    // their emphasis). Faux italics smear the pixel grid, so don't
    // synthesize those.
    fontSynthesis: 'weight',
  },
  'ul, ol': { listStyle: 'none', margin: 0, padding: 0 },
  p: { margin: 0 },
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
    fontFamily: fonts.body,
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
  'h1, h2, h3, h4, h5, h6, legend, td, th, .MuiTypography-h1, .MuiTypography-h2, .MuiTypography-h3, .MuiTypography-h4, .MuiTypography-h5, .MuiTypography-h6, .MuiButtonBase-root':
    {
      fontFamily: fonts.display,
    },
  '.danger-text': { color: colors.error },
  '.success-text': { color: colors.success },
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
  // Pixel art has no anti-aliased curves. Corners are notched by the 9-slice
  // frames instead.
  shape: { borderRadius: 0 },
  shadows,
  typography: {
    fontFamily: fonts.body,
    // Buttons and Tabs derive their default styles from this rather than
    // the `.MuiButtonBase-root` CssBaseline override below, which loses the
    // cascade to their own emotion-generated styles.
    button: {
      fontFamily: fonts.display,
      textTransform: 'none',
    },
    // DialogTitle (used by every modal header, e.g. Farmer's Log, Price
    // Events) renders variant="h6". Same cascade issue as `button` above.
    h6: {
      fontFamily: fonts.display,
      fontSize: '1.4em',
    },
    // CardHeader titles default to variant="h5" when no avatar is passed
    // (e.g. the peer name headers in the Active Players modal). Same
    // cascade issue as `button`/`h6` above.
    h5: {
      fontFamily: fonts.display,
    },
  },
  components: {
    MuiCssBaseline: {
      // Each @font-face rule needs its own style object: emotion collapses
      // an array of them under a single '@font-face' key into one rule.
      styleOverrides: () => [
        ...fontFaces.map(fontFace => ({ '@font-face': fontFace })),
        globalStyleOverrides,
      ],
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          ...pixelFrameSx({ outline: colors.cardOutline }),
          backgroundColor: '#ffeec6',
          boxShadow: pixelBevel(),
        },
        indicator: {
          height: px(1),
        },
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
            backgroundColor: colors.cardBackgroundNested,
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
        root: {
          textTransform: 'none',
          // Ripples and focus pulses are circular by default, which clashes
          // with the square pixel art controls.
          '& .MuiTouchRipple-root .MuiTouchRipple-child': { borderRadius: 0 },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: ({ ownerState, theme }) => {
          const outline = outlineFor(theme, ownerState.color)

          switch (ownerState.variant) {
            case 'contained':
              return raisedControlSx(outline)

            case 'outlined':
              return {
                ...pixelFrameSx({ outline, shadow: true }),
                '&:hover': pixelFrameSx({ outline, shadow: true }),
                '&:active': {
                  ...pixelPressedSx(outline),
                  boxShadow: 'none',
                },
                '&.Mui-disabled': pixelFrameSx({
                  outline: colors.disabledOutline,
                  shadow: 'pressed',
                }),
              }

            default:
              // Text buttons get an invisible frame of the same size so
              // they don't shift the layout when toggled to another variant
              // (e.g. selected items in ItemList and Toolbelt).
              return pixelFrameSx({ outline: 'transparent', shadow: 'pressed' })
          }
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...raisedControlSx(outlineFor(theme, ownerState.color)),
          // Fabs are normally round. Keep them square (with notched
          // corners) to match the rest of the pixel art UI.
          borderRadius: 0,
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { backgroundColor: '#fff7e7' },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          ...pixelFrameSx({ outline: colors.cardOutline, shadow: true }),
          boxShadow: pixelBevel(),
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...cardStyleSx(theme),
          '&:before': { display: 'none' },
          '&.Mui-expanded': { margin: `${px(2)} 0` },
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderWidth: 2,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        thumb: {
          borderRadius: 0,
          boxShadow: `${pixelBevel()}, ${px(1)} ${px(1)} 0 0 ${pixelShadowColor}`,
        },
        track: {
          borderRadius: 0,
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        thumb: {
          borderRadius: 0,
          boxShadow: pixelBevel(),
          '&:hover, &.Mui-focusVisible, &.Mui-active': {
            boxShadow: pixelBevelPressed,
          },
          '&:before': { boxShadow: 'none' },
        },
        rail: { borderRadius: 0 },
        track: { borderRadius: 0 },
      },
    },
    MuiSelect: {
      defaultProps: {
        IconComponent: ArrowDropDownIcon,
      },
    },
    MuiCheckbox: {
      defaultProps: {
        icon: createElement(CheckBoxOutlineBlankIcon),
        checkedIcon: createElement(CheckBoxIcon),
        indeterminateIcon: createElement(IndeterminateCheckBoxIcon),
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          ...pixelFrameSx({ outline: colors.neutralOutline }),
          backgroundColor: 'rgba(60, 50, 40, 0.94)',
          boxShadow: pixelBevel({
            highlight: 'rgba(255, 255, 255, 0.15)',
            lowlight: 'rgba(0, 0, 0, 0.25)',
          }),
          '& p': { textAlign: 'center' },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: { display: 'block' },
        paper: {
          ...pixelFrameSx({ outline: colors.dialogOutline, shadow: true }),
          backgroundImage: `url(${lightBlueStripeBg})`,
          boxShadow: pixelBevel(),
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { margin: '1.5em 0' },
      },
    },
    MuiAlert: {
      defaultProps: {
        iconMapping: {
          success: createElement(SuccessIcon, { fontSize: 'inherit' }),
          info: createElement(InfoIcon, { fontSize: 'inherit' }),
          warning: createElement(WarningIcon, { fontSize: 'inherit' }),
          error: createElement(ErrorIcon, { fontSize: 'inherit' }),
        },
      },
      styleOverrides: {
        // 24px keeps each of the 12x12 pixel icon's art pixels at a whole
        // number of CSS pixels (MUI's default is 22px).
        icon: { fontSize: 24 },
        root: ({ ownerState, theme }) => {
          const outline = outlineFor(theme, ownerState.severity ?? 'success')

          return {
            ...pixelFrameSx({ outline, shadow: true }),
            boxShadow: pixelBevel(),
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
          }
        },
      },
    },
  },
})

// Re-exported so Farmhand.tsx can reference the same sidebar background
// asset without importing it a second time.
export { blueStripeBg }
