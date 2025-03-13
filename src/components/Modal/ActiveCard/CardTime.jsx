import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'


function CardTime({ cardDeadline, onUpdateCardDeadline }) {

  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    if (cardDeadline) {
      setSelectedDate(dayjs(cardDeadline)) // Convert deadline timestamp to `dayjs`
    }
  }, [cardDeadline])

  const handleUpdateDeadline = async () => {
    if (!selectedDate) {
      toast.error('Please select a valid deadline.')
      return
    }

    try {
      console.log(selectedDate.toDate())
      onUpdateCardDeadline(selectedDate.toDate())
      toast.success('Deadline updated successfully.')
    } catch (error) {
      toast.error('Failed to update deadline.')
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}> {/* Wrap here */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <WatchLaterOutlinedIcon />
          <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Deadline</Typography>
        </Box>

        <DateTimePicker
          label="Set Deadline"
          value={selectedDate}
          onChange={setSelectedDate}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />

        <Button
          sx={{ alignSelf: 'flex-start' }}
          onClick={handleUpdateDeadline}
          variant="contained"
          color="primary"
        >
          Save Deadline
        </Button>
      </Box>
    </LocalizationProvider>
  )
}

export default CardTime
