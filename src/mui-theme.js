import { createMuiTheme } from '@material-ui/core'

export default createMuiTheme({
  typography: {
    // Needed to silence this warning:
    // https://material-ui.com/style/typography/#migration-to-typography-v2
    useNextVariants: true,
  },
})
