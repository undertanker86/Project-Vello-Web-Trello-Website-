import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { orange, cyan, blue, lightBlue } from '@mui/material/colors'

// Create a theme instance.
const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: blue[500],
          light: blue[300],
          dark: blue[700]
        },
        secondary: {
          main: lightBlue[500],
          light: lightBlue[300],
          dark: lightBlue[700]
        }
      }
    },
    dark: {
      palette: {
        primary: cyan,
        secondary: orange
      }
    }
  }
  // ...other properties
})

export default theme