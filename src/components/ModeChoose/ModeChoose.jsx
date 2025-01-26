
import { useColorScheme } from '@mui/material/styles'

import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'

function ModeChoose() {
  const { mode, setMode } = useColorScheme()
  const handleChange = (event) => {
    const selectedMode = event.target.value
    setMode(selectedMode)
  }

  return (
    <FormControl sx={{minWidth: 120 }} size="small">
      <InputLabel 
      id="label-dark-light-mode"
      sx={{
        color: 'white',
        '&.Mui-focused': { color: 'white'}
      }}
      >Mode</InputLabel>
      <Select
        labelId="label-dark-light-mode"
        id="select-dark-light-mode"
        value={mode}
        label="Mode"
        onChange={handleChange}
        sx={{
          color: 'white',
          '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },

          // '&:before': { borderColor: 'white' },
          // '&:after': { borderColor: 'white' },
          // '&:hover:not(.Mui-disabled):before': { borderColor: 'white' }
        }}
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

export default ModeChoose;