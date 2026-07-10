// Design tokens migrated from the legacy src/styles/variables.sass.
//
// These are plain constants rather than MUI theme values because
// components read them directly in `sx`, including in unit tests that
// render components without a `<ThemeProvider>` — putting them on a
// custom theme augmentation would make them `undefined` in that context.

export const colors = {
  itemBackground: '#f7b459',
  heart: '#ff4040',
  error: '#ce0000',
  cardBackground: '#ffe3a1',
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

export const layout = {
  cardMaxWidth: 550,
  sidebarWidth: '22em',
  narrowSidebarWidth: 320,
  fieldSpaceForRightSideControls: '4.5em',
} as const
