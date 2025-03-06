import { useState } from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import AddIcon from '@mui/icons-material/Add'
import Badge from '@mui/material/Badge'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

function CardUserGroup({ cardMemberIds = [] }) {
  /**
   * Handle Popover to hide or show all users on a popup, similar docs for reference here::
   * https://mui.com/material-ui/react-popover/
   */
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'card-all-users-popover' : undefined
  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }

  // Note here we do not use MUI's AvatarGroup Component because it does not support well when we need to customize & trigger to process the final calculation element, simply use Box and CSS - Style the Avatar group to standardize the calculation a bit..
  return (
    <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {/* Show users who are members of the card*/}
      {[...Array(8)].map((_, index) =>
        <Tooltip title="trungquandev" key={index}>
          <Avatar
            sx={{ width: 34, height: 34, cursor: 'pointer' }}
            alt="trungquandev"
            src="https://trungquandev.com/wp-content/uploads/2019/06/trungquandev-cat-avatar.png"
          />
        </Tooltip>
      )}

      {/* This button opens the add member popover */}
      <Tooltip title="Add new member">
        <Box
          aria-describedby={popoverId}
          onClick={handleTogglePopover}
          sx={{
            width: 36,
            height: 36,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '600',
            borderRadius: '50%',
            color: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
            bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2f3542' : theme.palette.grey[200],
            '&:hover': {
              color: (theme) => theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
            }
          }}
        >
          <AddIcon fontSize="small" />
        </Box>
      </Tooltip>

      {/* When clicking on + above, a popover will open showing all users in the board for users to click and add to the card. */}
      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, maxWidth: '260px', display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          {[...Array(16)].map((_, index) =>
            <Tooltip title="trungquandev" key={index}>
              {/* How to make Avatar with badge icon: https://mui.com/material-ui/react-avatar/#with-badge */}
              <Badge
                sx={{ cursor: 'pointer' }}
                overlap="rectangular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={<CheckCircleIcon fontSize="small" sx={{ color: '#27ae60' }} />}
              >
                <Avatar
                  sx={{ width: 34, height: 34 }}
                  alt="trungquandev"
                  src="https://trungquandev.com/wp-content/uploads/2019/06/trungquandev-cat-avatar.png"
                />
              </Badge>
            </Tooltip>
          )}
        </Box>
      </Popover>
    </Box>
  )
}

export default CardUserGroup
