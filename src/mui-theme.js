import createTheme from '@mui/material/styles/createTheme'

export default createTheme({
  palette: {
    mode: 'light',
  },
  components: {
    MuiTabs: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: '#ffeec6',
          borderColor: '#9b6d00',
          borderWidth: 2,
          borderStyle: 'solid',
          borderRadius: theme.shape.borderRadius,
        }),
      },
    },
  },
})
