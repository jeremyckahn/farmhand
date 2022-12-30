import { createTheme } from '@material-ui/core'

export default createTheme({
  typography: {
    // Needed to silence this warning:
    // https://material-ui.com/style/typography/#migration-to-typography-v2
    useNextVariants: true,
  },
})
