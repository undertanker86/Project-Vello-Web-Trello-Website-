import moment from 'moment'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'

import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../../redux/user/userSlice'

function CardActivitySection() {
  const currentUser = useSelector(selectCurrentUser)

  const handleAddCardComment = (event) => {
    // Capture user action pressing Enter key && not Shift + Enter action
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault() //Add this line so that when Enter is pressed, the line will not jump.
      if (!event.target?.value) return // If there is no value, return does nothing.

      // Create a commend data variable to send to the api
      const commentToAdd = {
        userAvatar: currentUser?.avatar,
        userDisplayName: currentUser?.displayName,
        content: event.target.value.trim()
      }
      console.log(commentToAdd)
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      {/* Process adding comments to Card */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Avatar
          sx={{ width: 36, height: 36, cursor: 'pointer' }}
          alt="trungquandev"
          src={currentUser?.avatar}
        />
        <TextField
          fullWidth
          placeholder="Write a comment..."
          type="text"
          variant="outlined"
          multiline
          onKeyDown={handleAddCardComment}
        />
      </Box>

      {/* Show list of comments*/}
      {[...Array(0)].length === 0 &&
        <Typography sx={{ pl: '45px', fontSize: '14px', fontWeight: '500', color: '#b1b1b1' }}>No activity found!</Typography>
      }
      {[...Array(6)].map((_, index) =>
        <Box sx={{ display: 'flex', gap: 1, width: '100%', mb: 1.5 }} key={index}>
          <Tooltip title="trungquandev">
            <Avatar
              sx={{ width: 36, height: 36, cursor: 'pointer' }}
              alt="trungquandev"
              src="https://trungquandev.com/wp-content/uploads/2019/06/trungquandev-cat-avatar.png"
            />
          </Tooltip>
          <Box sx={{ width: 'inherit' }}>
            <Typography variant="span" sx={{ fontWeight: 'bold', mr: 1 }}>
              Quan Do
            </Typography>

            <Typography variant="span" sx={{ fontSize: '12px' }}>
              {moment().format('llll')}
            </Typography>

            <Box sx={{
              display: 'block',
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#33485D' : 'white',
              p: '8px 12px',
              mt: '4px',
              border: '0.5px solid rgba(0, 0, 0, 0.2)',
              borderRadius: '4px',
              wordBreak: 'break-word',
              boxShadow: '0 0 1px rgba(0, 0, 0, 0.2)'
            }}>
              This is a comment!
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default CardActivitySection
