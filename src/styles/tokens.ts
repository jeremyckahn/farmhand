// Design tokens migrated from the legacy src/styles/variables.sass.
//
// These are plain constants rather than MUI theme values because
// components read them directly in `sx`, including in unit tests that
// render components without a `<ThemeProvider>` — putting them on a
// custom theme augmentation would make them `undefined` in that context.

export const colors = {
  itemBackground: '#f7b459',
  heart: '#ff4040',
  error: '#b23a22',
  success: '#4f7a2e',
  cardBackground: '#ffe3a1',
  cardOutline: '#6b4423',
  dialogOutline: '#4a2e17',
  neutralOutline: '#2b2118',
  disabledOutline: 'rgba(60, 40, 20, 0.26)',
  // Warm, earthy surfaces and text shared by the MUI palette and the
  // components that style themselves directly.
  pageBackground: '#f1e0bf',
  surface: '#fff7e7',
  surfaceMuted: '#f5ead3',
  tabBackground: '#ffeec6',
  tableBorder: '#d9b777',
  textPrimary: '#3b2a1a',
  textSecondary: '#6b5239',
  textDisabled: '#a38c6f',
  link: '#8b4a1c',
  inputBackground: '#fffaf0',
  inputText: '#3b2a1a',
  inputPlaceholder: '#8f7a5e',
  // Matches the legacy Sass `color.adjust($card-background, $lightness: -10%)`
  // for cards nested inside other cards. MUI's `darken()` helper uses a
  // different (multiplicative) algorithm and produces a visibly duller color.
  cardBackgroundNested: '#ffd46e',
  cow: {
    blue: '#8ff0f9',
    brown: '#b45f28',
    green: '#65f295',
    orange: '#ff7031',
    purple: '#d884f2',
    white: '#ffffff',
    yellow: '#fff931',
  },
} as const

// MUI's stock palette colors. Buttons, Fabs and value indicators keep these
// rather than following the brown theme palette, so those controls stay as
// recognizable as they were before the palette was rethemed.
export const legacyControlColors = {
  primary: { main: '#1976d2', dark: '#1565c0', contrastText: '#fff' },
  secondary: { main: '#9c27b0', dark: '#7b1fa2', contrastText: '#fff' },
  error: { main: '#d32f2f', dark: '#c62828', contrastText: '#fff' },
  warning: { main: '#ed6c02', dark: '#e65100', contrastText: '#fff' },
  info: { main: '#0288d1', dark: '#01579b', contrastText: '#fff' },
  success: { main: '#2e7d32', dark: '#1b5e20', contrastText: '#fff' },
} as const

// NOTE: These intentionally do not match the app's actual MUI theme
// `breakpoints.values` (MUI v5 defaults: 600/900/1200/1536). They mirror
// the MUI v4 breakpoints the legacy Sass was authored against, preserved
// here verbatim so migrating away from Sass doesn't shift any layout.
export const breakpoints = {
  smallPhone: 320,
  mediumPhone: 400,
  largePhone: 450,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
} as const

// Pixel fonts. `display` is used for headings, buttons and other UI labels;
// `body` is used for running text.
export const fonts = {
  display: '"Farmhand Display", sans-serif',
  body: '"Farmhand Body", sans-serif',
} as const

export const layout = {
  cardMaxWidth: 550,
  sidebarWidth: '22em',
  narrowSidebarWidth: 320,
  fieldSpaceForRightSideControls: '4.5em',
} as const
