import createTheme from '@mui/material/styles/createTheme'

export default createTheme({
  palette: {
    mode: 'light',
  },
  shape: {},
  components: {
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
          '& input': {
            padding: '0.5rem',
          },
        },
      },
    },
  },
})
