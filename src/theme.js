import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
// import { orange, cyan, blue, lightBlue } from '@mui/material/colors'
const HEIGHT_APP_BAR = '58px'
const HEIGHT_BOARD_BAR = '60px'
const HEIGHT_BOARD_CONTENT = `calc(100vh - ${HEIGHT_APP_BAR} - ${HEIGHT_BOARD_BAR})`
const HEIGHT_HEADER_COLUMN = '50px'
const HEIGHT_FOOTER_COLUMN = '50px'
// Create a theme instance.
const theme = extendTheme({
  controllCustomer:{
    topBarHeight: HEIGHT_APP_BAR,
    boardBarHeight: HEIGHT_BOARD_BAR,
    boardContentHeight: HEIGHT_BOARD_CONTENT,
    heightHeaderColumn: HEIGHT_HEADER_COLUMN,
    heightFooterColumn: HEIGHT_FOOTER_COLUMN,
  },

  colorSchemes: {
    // light: {
    //   palette: {
    //     primary: {
    //       main: blue[500],
    //       light: blue[300],
    //       dark: blue[700]
    //     },
    //     secondary: {
    //       main: lightBlue[500],
    //       light: lightBlue[300],
    //       dark: lightBlue[700]
    //     }
    //   }
    // },
    // dark: {
    //   palette: {
    //     primary: cyan,
    //     secondary: orange
    //   }
    // }
  },
    components: {
      MuiTypography:{
        styleOverrides: {
          // Name of the slot
          root: {
              // color: theme.palette.primary.main,
              '&.MuiTypography-body1': {
                fontSize: '0.875rem',
              },
            }
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            '*::-webkit-scrollbar': {
              width: '5px',
              height: '5px',
            },
            // '*::-webkit-scrollbar-thumb': {
            //   backgroundColor: '#bdc3c7',
            //   borderRadius: '10px',
            // },
            '*::-webkit-scrollbar-thumb': {
              backgroundColor: '#95a5a6',
              borderRadius: '10px',
            },
            '*::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#7f8c8d',
            },
          }
      },
    },
      // Name of the component
      MuiButton: {
        styleOverrides: {
          // Name of the slot
          root: {
            // Some CSS
            textTransform: 'none',
            fontWeight: 'bold',
            borderWidth: '0.5px',
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          // Name of the slot
          root: {
              // color: theme.palette.primary.main,
              fontSize: '0.875rem',
              fontWeight: 'bold',
            }
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            fontSize: '0.875rem',
            '& fieldset': { borderWidth: '0.5px  !important' },
            '&:hover fieldset': { borderWidth: '2px  !important' },
            '&.Mui-focused fieldset': { borderWidth: '2px  !important' },
          }
        },
      },
    },

})

export default theme