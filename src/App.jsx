
import { useColorScheme } from '@mui/material/styles'

import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'

import Container from '@mui/material/Container'
import Box from '@mui/material/Box'

function ModeChoose() {
  const { mode, setMode } = useColorScheme()
  const handleChange = (event) => {
    const selectedMode = event.target.value
    setMode(selectedMode)
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="label-dark-light-mode">Mode</InputLabel>
      <Select
        labelId="label-dark-light-mode"
        id="select-dark-light-mode"
        value={mode}
        label="Mode"
        onChange={handleChange}
      >
        <MenuItem value="light">
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
          <LightModeIcon fontSize = 'small' /> Light
          </div>
        </MenuItem>
        <MenuItem value="dark">
        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
          <DarkModeIcon fontSize = 'small' /> Dark
        </div>
        </MenuItem>
        <MenuItem value="system">
        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
          <SystemUpdateAltIcon fontSize = 'small' /> System
        </div>
        </MenuItem>
      </Select>
    </FormControl>
  )
}


function App() {

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh', backgroundColor: 'primary.main'}}>
      <Box sx ={{
        backgroundColor: 'primary.light',
        width: '100%',
        height: (theme) => theme.controllCustomer.topBarHeight,
        display: 'flex',
        alignItems: 'center',
      }}>
        <ModeChoose />
      </Box>
      <Box sx={{
        backgroundColor: 'primary.dark',
        width: '100%',
        height: (theme) => theme.controllCustomer.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
      }}>
        Board Bar
      </Box>
      <Box sx={{
          backgroundColor: 'primary.main',
          width: '100%',
          height: (theme) => `calc(100vh - ${theme.controllCustomer.topBarHeight} - ${theme.controllCustomer.boardBarHeight})`,
          display: 'flex',
          alignItems: 'center',
      }}>
        Box Content
      </Box>
      
    </Container>
  )
}

export default App
