import { useState } from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'

function BoardUserGroup({ boardUsers = [], limit = 4 }) {
  /**
   * Popover handling to hide or show all users on a popup, similar docs for reference here:
   * https://mui.com/material-ui/react-popover/
   */
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'board-all-users-popover' : undefined
  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }

  // Note here we do not use MUI's AvatarGroup Component because it does not support well when we need to customize & trigger to process the final calculation element, simply use Box and CSS - Style the Avatar group to standardize the calculation a bit.
  return (
    <Box sx={{ display: 'flex', gap: '4px' }}>
      {/* Display the limit of the number of users by limit number */}
      {boardUsers.map(( user, index) => {
        if (index < limit) {
          return (
            <Tooltip title={user?.displayName} key={index}>
              <Avatar
                sx={{ width: 34, height: 34, cursor: 'pointer' }}
                alt={user?.displayName} 
                src={user?.avatar} 
              />
            </Tooltip>
          )
        }
      })}

      {/* If the number of users is more than the limit, +number will be displayed. */}
      {boardUsers.length > limit &&
        <Tooltip title="Show more">
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
              fontWeight: '500',
              borderRadius: '50%',
              color: 'white',
              backgroundColor: '#a4b0be'
            }}
          >
            +{boardUsers.length - limit}
          </Box>
        </Tooltip>
      }

      {/* When you click on +number above, a popover will open showing all users, there will be no more limit. */}
      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, maxWidth: '235px', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {boardUsers.map(( user, index) =>
            <Tooltip title={user?.displayName} key={index}>
              <Avatar
                sx={{ width: 34, height: 34, cursor: 'pointer' }}
                alt={user?.displayName} 
                src={user?.avatar}
              />
            </Tooltip>
          )}
        </Box>
      </Popover>
    </Box>
  )
}

export default BoardUserGroup
