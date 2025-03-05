
import { useState } from 'react'
import TextField from '@mui/material/TextField'

// A pretty good CSS trick in UI UX when needing to hide or show an input: Simply put, instead of having to create a State variable to switch back and forth between the Input and Text tags normally, we will CSS the Input tag to look like normal text, only when clicking and focusing on it, the style will return to the original input.

function ToggleFocusInput({ value, onChangedValue, inputFontSize = '16px', ...props }) {
  const [inputValue, setInputValue] = useState(value)

  // Blur is when we no longer have Focus on the element, it will trigger the action here.
  const triggerBlur = () => {
    // Support Trim the State inputValue data to make it look nice after blurring it out.
    setInputValue(inputValue.trim())

    // If the value does not change or if the user deletes all the content, reset the original value according to the value from props and return without doing anything else.
    if (!inputValue || inputValue.trim() === value) {
      setInputValue(value)
      return
    }
    // console.log('value: ', value)
    // console.log('inputValue: ', inputValue)
    // When the value changes ok, call the func in the parent Props to process.
    onChangedValue(inputValue)
  }

  return (
    <TextField
      id="toggle-focus-input-controlled"
      fullWidth
      variant='outlined'
      size="small"
      value={inputValue}
      onChange={(event) => { setInputValue(event.target.value) }}
      onBlur={triggerBlur}
      {...props}

      sx={{
        '& label': {},
        '& input': { fontSize: inputFontSize, fontWeight: 'bold' },
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'transparent',
          '& fieldset': { borderColor: 'transparent' }
        },
        '& .MuiOutlinedInput-root:hover': {
          borderColor: 'transparent',
          '& fieldset': { borderColor: 'transparent' }
        },
        '& .MuiOutlinedInput-root.Mui-focused': {
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#33485D' : 'white',
          '& fieldset': { borderColor: 'primary.main' }
        },
        '& .MuiOutlinedInput-input': {
          px: '6px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }
      }}
    />
  )
}

export default ToggleFocusInput
