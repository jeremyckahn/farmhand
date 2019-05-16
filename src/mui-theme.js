import { createMuiTheme } from '@material-ui/core';

export default createMuiTheme({
  transitions: {
    // https://material-ui.com/getting-started/faq/#how-can-i-disable-animations-globally
    create: () => '',
  },
  typography: {
    // Needed to silence this warning:
    // https://material-ui.com/style/typography/#migration-to-typography-v2
    useNextVariants: true,
  },
});
